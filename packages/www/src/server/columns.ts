import { createServerFn } from '@tanstack/react-start'
import { and, eq } from 'drizzle-orm'
import { db } from '@/db'
import { columnsTable } from '@/db/schema.kanban'
import { columnSchema } from '@/lib/schemas'
import { withIsoTimestamps } from '@/lib/utils'
import { requireSession } from '@/server/session.server'

export const getColumns = createServerFn({ method: 'GET' }).handler(
	async () => {
		const { user } = await requireSession()

		const rows = await db
			.select({
				id: columnsTable.id,
				title: columnsTable.title,
				boardId: columnsTable.boardId,
				createdAt: columnsTable.createdAt,
				updatedAt: columnsTable.updatedAt,
				position: columnsTable.position,
			})
			.from(columnsTable)
			.where(eq(columnsTable.userId, user.id))

		return rows.map(withIsoTimestamps)
	},
)

export const createColumn = createServerFn({ method: 'POST' })
	.validator(columnSchema)
	.handler(async ({ data }) => {
		const { user } = await requireSession()
		await db.insert(columnsTable).values({ userId: user.id, ...data })
		return data
	})

export const updateColumn = createServerFn({ method: 'POST' })
	.validator(columnSchema)
	.handler(async ({ data }) => {
		const { user } = await requireSession()

		await db
			.update(columnsTable)
			.set(data)
			.where(
				and(eq(columnsTable.userId, user.id), eq(columnsTable.id, data.id)),
			)

		return data
	})

export const deleteColumn = createServerFn({ method: 'POST' })
	.validator(columnSchema.pick({ id: true }))
	.handler(async ({ data }) => {
		const { user } = await requireSession()

		await db
			.delete(columnsTable)
			.where(
				and(eq(columnsTable.userId, user.id), eq(columnsTable.id, data.id)),
			)

		return { id: data.id }
	})
