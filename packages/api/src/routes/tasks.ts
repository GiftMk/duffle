import { zValidator } from '@hono/zod-validator'
import { and, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { db } from '../db'
import { tasksTable } from '../db/schema.kanban'
import type { RequestEnv } from '../lib/auth'
import { requireAuth } from '../lib/auth'
import { taskSchema } from '../lib/schemas'
import { withIsoTimestamps } from '../lib/utils'

export const tasksRoutes = new Hono<RequestEnv>()
	.get('/', requireAuth, async (c) => {
		const user = c.get('user')

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

		return c.json(
			rows.map((row) =>
				withIsoTimestamps({
					...row,
					description: row.description ?? undefined,
				}),
			),
			200,
		)
	})
	.post('/create', requireAuth, zValidator('json', taskSchema), async (c) => {
		const user = c.get('user')
		const task = c.req.valid('json')

		await db.insert(tasksTable).values({ userId: user.id, ...task })

		return c.json(task, 201)
	})
	.put('/update', requireAuth, zValidator('json', taskSchema), async (c) => {
		const user = c.get('user')
		const task = c.req.valid('json')

		await db
			.update(tasksTable)
			.set(task)
			.where(and(eq(tasksTable.userId, user.id), eq(tasksTable.id, task.id)))

		return c.json(task, 200)
	})
	.delete(
		'/delete',
		requireAuth,
		zValidator('json', taskSchema.pick({ id: true })),
		async (c) => {
			const user = c.get('user')
			const { id } = c.req.valid('json')

			await db
				.delete(tasksTable)
				.where(and(eq(tasksTable.userId, user.id), eq(tasksTable.id, id)))

			return c.json({ id }, 200)
		},
	)
