export * from './lib/schemas'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { env } from './env'
import { auth, type RequestEnv } from './lib/auth'
import { boardsRoutes } from './routes/boards'
import { columnsRoutes } from './routes/columns'
import { tasksRoutes } from './routes/tasks'

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

app.on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw))

const apiRoutes = new Hono<RequestEnv>()
	.get('/ping', (c) => c.text('pong'))
	.route('/boards', boardsRoutes)
	.route('/columns', columnsRoutes)
	.route('/tasks', tasksRoutes)

export default app
export const routes = app.route('/api', apiRoutes)
export type AppType = typeof routes
