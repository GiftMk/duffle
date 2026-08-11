import { columnsTable } from '@duffle/db/schema.kanban'
import { withIsoTimestamps } from '@duffle/utils'
import { createServerFn } from '@tanstack/react-start'
import { and, eq } from 'drizzle-orm'
import { columnSchema } from '@/lib/schemas'
import { withDb } from '@/server/middleware'
import { requireSession } from '@/server/session.server'

export const getColumnsFn = createServerFn({ method: 'GET' })
	.middleware([withDb])
	.handler(async ({ context }) => {
		const { user } = await requireSession()

		const rows = await context.db
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
	})

export const createColumnFn = createServerFn({ method: 'POST' })
	.middleware([withDb])
	.validator(columnSchema)
	.handler(async ({ data, context }) => {
		const { user } = await requireSession()
		await context.db.insert(columnsTable).values({ userId: user.id, ...data })
		return data
	})

export const updateColumnFn = createServerFn({ method: 'POST' })
	.middleware([withDb])
	.validator(columnSchema)
	.handler(async ({ data, context }) => {
		const { user } = await requireSession()

		await context.db
			.update(columnsTable)
			.set(data)
			.where(
				and(eq(columnsTable.userId, user.id), eq(columnsTable.id, data.id)),
			)

		return data
	})

export const deleteColumnFn = createServerFn({ method: 'POST' })
	.middleware([withDb])
	.validator(columnSchema.pick({ id: true }))
	.handler(async ({ data, context }) => {
		const { user } = await requireSession()

		await context.db
			.delete(columnsTable)
			.where(
				and(eq(columnsTable.userId, user.id), eq(columnsTable.id, data.id)),
			)

		return { id: data.id }
	})
