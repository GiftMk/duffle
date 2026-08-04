import { zValidator } from '@hono/zod-validator'
import { and, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { db } from '../db'
import { boardsTable } from '../db/schema.kanban'
import type { RequestEnv } from '../lib/auth'
import { requireAuth } from '../lib/auth'
import { boardSchema } from '../lib/schemas'
import { withIsoTimestamps } from '../lib/utils'

export const boardsRoutes = new Hono<RequestEnv>()
	.get('/', requireAuth, async (c) => {
		const user = c.get('user')

		const rows = await db
			.select({
				id: boardsTable.id,
				title: boardsTable.title,
				createdAt: boardsTable.createdAt,
				updatedAt: boardsTable.updatedAt,
			})
			.from(boardsTable)
			.where(eq(boardsTable.userId, user.id))

		return c.json(rows.map(withIsoTimestamps), 200)
	})
	.post('/create', requireAuth, zValidator('json', boardSchema), async (c) => {
		const user = c.get('user')
		const board = c.req.valid('json')

		await db.insert(boardsTable).values({ userId: user.id, ...board })

		return c.json(board, 201)
	})
	.put('/update', requireAuth, zValidator('json', boardSchema), async (c) => {
		const user = c.get('user')
		const board = c.req.valid('json')

		await db
			.update(boardsTable)
			.set(board)
			.where(and(eq(boardsTable.userId, user.id), eq(boardsTable.id, board.id)))

		return c.json(board, 200)
	})
	.delete(
		'/delete',
		requireAuth,
		zValidator('json', boardSchema.pick({ id: true })),
		async (c) => {
			const user = c.get('user')
			const { id } = c.req.valid('json')

			await db
				.delete(boardsTable)
				.where(and(eq(boardsTable.userId, user.id), eq(boardsTable.id, id)))

			return c.json({ id }, 200)
		},
	)
