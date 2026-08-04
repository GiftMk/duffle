import { zValidator } from '@hono/zod-validator'
import { and, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { db } from '../db'
import { columnsTable } from '../db/schema.kanban'
import type { RequestEnv } from '../lib/auth'
import { requireAuth } from '../lib/auth'
import { columnSchema } from '../lib/schemas'
import { withIsoTimestamps } from '../lib/utils'

export const columnsRoutes = new Hono<RequestEnv>()
	.get('/', requireAuth, async (c) => {
		const user = c.get('user')

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

		return c.json(rows.map(withIsoTimestamps), 200)
	})
	.post('/create', requireAuth, zValidator('json', columnSchema), async (c) => {
		const user = c.get('user')
		const column = c.req.valid('json')

		await db.insert(columnsTable).values({ userId: user.id, ...column })

		return c.json(column, 201)
	})
	.put('/update', requireAuth, zValidator('json', columnSchema), async (c) => {
		const user = c.get('user')
		const column = c.req.valid('json')

		await db
			.update(columnsTable)
			.set(column)
			.where(
				and(eq(columnsTable.userId, user.id), eq(columnsTable.id, column.id)),
			)

		return c.json(column, 200)
	})
	.delete(
		'/delete',
		requireAuth,
		zValidator('json', columnSchema.pick({ id: true })),
		async (c) => {
			const user = c.get('user')
			const { id } = c.req.valid('json')

			await db
				.delete(columnsTable)
				.where(and(eq(columnsTable.userId, user.id), eq(columnsTable.id, id)))

			return c.json({ id }, 200)
		},
	)
