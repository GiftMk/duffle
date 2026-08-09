import { createServerFn } from '@tanstack/react-start'
import { and, eq } from 'drizzle-orm'
import type { Database } from '@/db'
import { tasksTable } from '@/db/schema.kanban'
import { type TaskEntity, taskSchema } from '@/lib/schemas'
import { withIsoTimestamps } from '@/lib/utils'
import { generateEmbedding } from '@/server/embeddings'
import { withDb } from '@/server/middleware'
import { requireSession } from '@/server/session.server'

export const getTasksFn = createServerFn({ method: 'GET' })
	.middleware([withDb])
	.handler(async ({ context }) => {
		const { user } = await requireSession()

		const rows = await context.db
			.select({
				id: tasksTable.id,
				title: tasksTable.title,
				columnId: tasksTable.columnId,
				description: tasksTable.description,
				createdAt: tasksTable.createdAt,
				updatedAt: tasksTable.updatedAt,
				position: tasksTable.position,
			})
			.from(tasksTable)
			.where(eq(tasksTable.userId, user.id))

		return rows.map((row) =>
			withIsoTimestamps({
				...row,
				description: row.description ?? undefined,
			}),
		)
	})

export const createTaskFn = createServerFn({ method: 'POST' })
	.middleware([withDb])
	.validator(taskSchema)
	.handler(async ({ data, context }) => {
		const { user } = await requireSession()
		await context.db.insert(tasksTable).values({ userId: user.id, ...data })
		await persistEmbedding(context.db, user.id, data)
		return data
	})

export const updateTaskFn = createServerFn({ method: 'POST' })
	.middleware([withDb])
	.validator(taskSchema)
	.handler(async ({ data, context }) => {
		const { user } = await requireSession()

		await context.db
			.update(tasksTable)
			.set(data)
			.where(and(eq(tasksTable.userId, user.id), eq(tasksTable.id, data.id)))

		await persistEmbedding(context.db, user.id, data)
		return data
	})

export const deleteTaskFn = createServerFn({ method: 'POST' })
	.middleware([withDb])
	.validator(taskSchema.pick({ id: true }))
	.handler(async ({ data, context }) => {
		const { user } = await requireSession()

		await context.db
			.delete(tasksTable)
			.where(and(eq(tasksTable.userId, user.id), eq(tasksTable.id, data.id)))

		return { id: data.id }
	})

const persistEmbedding = async (
	db: Database,
	userId: string,
	task: TaskEntity,
) => {
	try {
		const embedding = await generateEmbedding(task.title, task.description)
		await db
			.update(tasksTable)
			.set({ embedding })
			.where(and(eq(tasksTable.userId, userId), eq(tasksTable.id, task.id)))
	} catch (error) {
		console.error(`Failed to persist embedding for task ${task.id}`, error)
	}
}
