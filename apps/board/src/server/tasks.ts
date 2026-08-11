import { tasksTable } from '@duffle/db/schema.kanban'
import { withIsoTimestamps } from '@duffle/utils'
import { createServerFn } from '@tanstack/react-start'
import { and, eq } from 'drizzle-orm'
import { taskSchema } from '@/lib/schemas'
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
