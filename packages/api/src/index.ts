export * from './lib/schemas.js'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { env } from './env.js'
import { auth, type RequestEnv } from './lib/auth.js'
import { boardsRoutes } from './routes/boards.js'
import { columnsRoutes } from './routes/columns.js'
import { tasksRoutes } from './routes/tasks.js'

const app = new Hono()

app.use(
	'/api/*',
	cors({
		origin: env.WEB_URL,
		credentials: true,
		allowHeaders: ['Content-Type'],
		allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
	}),
)

app.onError((err, c) => {
	console.error(err)
	return c.json({ error: 'internal_server_error' }, 500)
})

app.on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw))

const apiRoutes = new Hono<RequestEnv>()
	.get('/ping', (c) => c.text('pong'))
	.route('/boards', boardsRoutes)
	.route('/columns', columnsRoutes)
	.route('/tasks', tasksRoutes)

export default app
export const routes = app.route('/api', apiRoutes)
export type AppType = typeof routes
