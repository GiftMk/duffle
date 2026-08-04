import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { env } from './env'
import { auth, type RequestEnv, requireAuth } from './lib/auth'
import { db } from './db'
import { tasksTable } from './db/schema.kanban'
import { zValidator } from '@hono/zod-validator'
import { taskSchema } from './lib/schemas'
import { and, eq } from 'drizzle-orm'

export const app = new Hono()

app.use(
	'/api/*',
	cors({
		origin: env.WEB_URL,
		credentials: true,
		allowHeaders: ['Content-Type'],
		allowMethods: ['GET', 'POST'],
	}),
)

app.on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw))

const apiRoutes = new Hono<RequestEnv>()
	.basePath('/tasks')
	.post('/create', requireAuth, zValidator('json', taskSchema), async (c) => {
		const user = c.get('user')
		const task = c.req.valid('json')

		await db.insert(tasksTable).values({ userId: user.id, ...task })
	})
	.put('/update', requireAuth, zValidator('json', taskSchema), async (c) => {
		const user = c.get('user')
		const task = c.req.valid('json')

		await db
			.update(tasksTable)
			.set(task)
			.where(
				and(eq(tasksTable.userId, user.id), eq(tasksTable.id, task.columnId)),
			)
	})
	.delete(
		'/delete',
		requireAuth,
		zValidator('json', taskSchema.pick({ id: true })),
		async (c) => {
			const user = c.get('user')
			const task = c.req.valid('json')

			await db
				.delete(tasksTable)
				.where(and(eq(tasksTable.userId, user.id), eq(tasksTable.id, task.id)))
		},
	)

app.route('/api', apiRoutes)
