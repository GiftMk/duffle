import { createServerFn } from '@tanstack/react-start'
import { and, eq } from 'drizzle-orm'
import { db } from '@/db'
import { boardsTable } from '@/db/schema.kanban'
import { boardSchema } from '@/lib/schemas'
import { withIsoTimestamps } from '@/lib/utils'
import { requireSession } from '@/server/session.server'

export const getBoards = createServerFn({ method: 'GET' }).handler(async () => {
	const { user } = await requireSession()

	const rows = await db
		.select({
			id: boardsTable.id,
			title: boardsTable.title,
			createdAt: boardsTable.createdAt,
			updatedAt: boardsTable.updatedAt,
		})
		.from(boardsTable)
		.where(eq(boardsTable.userId, user.id))

	return rows.map(withIsoTimestamps)
})

export const createBoard = createServerFn({ method: 'POST' })
	.validator(boardSchema)
	.handler(async ({ data }) => {
		const { user } = await requireSession()
		await db.insert(boardsTable).values({ userId: user.id, ...data })
		return data
	})

export const updateBoard = createServerFn({ method: 'POST' })
	.validator(boardSchema)
	.handler(async ({ data }) => {
		const { user } = await requireSession()

		await db
			.update(boardsTable)
			.set(data)
			.where(and(eq(boardsTable.userId, user.id), eq(boardsTable.id, data.id)))

		return data
	})

export const deleteBoard = createServerFn({ method: 'POST' })
	.validator(boardSchema.pick({ id: true }))
	.handler(async ({ data }) => {
		const { user } = await requireSession()

		await db
			.delete(boardsTable)
			.where(and(eq(boardsTable.userId, user.id), eq(boardsTable.id, data.id)))

		return { id: data.id }
	})
