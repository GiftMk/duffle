import { createServerFn } from '@tanstack/react-start'
import { and, eq } from 'drizzle-orm'
import { db } from '@/db'
import { tasksTable } from '@/db/schema.kanban'
import { taskSchema } from '@/lib/schemas'
import { withIsoTimestamps } from '@/lib/utils'
import { requireSession } from '@/server/session.server'

export const getTasks = createServerFn({ method: 'GET' }).handler(async () => {
	const { user } = await requireSession()

	const rows = await db
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

export const createTask = createServerFn({ method: 'POST' })
	.validator(taskSchema)
	.handler(async ({ data }) => {
		const { user } = await requireSession()
		await db.insert(tasksTable).values({ userId: user.id, ...data })
		return data
	})

export const updateTask = createServerFn({ method: 'POST' })
	.validator(taskSchema)
	.handler(async ({ data }) => {
		const { user } = await requireSession()

		await db
			.update(tasksTable)
			.set(data)
			.where(and(eq(tasksTable.userId, user.id), eq(tasksTable.id, data.id)))

		return data
	})

export const deleteTask = createServerFn({ method: 'POST' })
	.validator(taskSchema.pick({ id: true }))
	.handler(async ({ data }) => {
		const { user } = await requireSession()

		await db
			.delete(tasksTable)
			.where(and(eq(tasksTable.userId, user.id), eq(tasksTable.id, data.id)))

		return { id: data.id }
	})
