import { boardsTable } from '@duffle/db/schema.kanban'
import { withIsoTimestamps } from '@duffle/utils'
import { createServerFn } from '@tanstack/react-start'
import { and, eq } from 'drizzle-orm'
import { boardSchema } from '@/lib/schemas'
import { withDb } from '@/server/middleware'
import { requireSession } from '@/server/session.server'

export const getBoardsFn = createServerFn({ method: 'GET' })
	.middleware([withDb])
	.handler(async ({ context }) => {
		const { user } = await requireSession()

		const rows = await context.db
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

export const createBoardFn = createServerFn({ method: 'POST' })
	.middleware([withDb])
	.validator(boardSchema)
	.handler(async ({ data, context }) => {
		const { user } = await requireSession()
		await context.db.insert(boardsTable).values({ userId: user.id, ...data })
		return data
	})

export const updateBoardFn = createServerFn({ method: 'POST' })
	.middleware([withDb])
	.validator(boardSchema)
	.handler(async ({ data, context }) => {
		const { user } = await requireSession()

		await context.db
			.update(boardsTable)
			.set(data)
			.where(and(eq(boardsTable.userId, user.id), eq(boardsTable.id, data.id)))

		return data
	})

export const deleteBoardFn = createServerFn({ method: 'POST' })
	.middleware([withDb])
	.validator(boardSchema.pick({ id: true }))
	.handler(async ({ data, context }) => {
		const { user } = await requireSession()

		await context.db
			.delete(boardsTable)
			.where(and(eq(boardsTable.userId, user.id), eq(boardsTable.id, data.id)))

		return { id: data.id }
	})
