import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { env } from './env'
import { auth } from './lib/auth'

export const app = new Hono()

app.use(
	'/api/auth/*',
	cors({
		origin: env.WEB_URL,
		credentials: true,
		allowHeaders: ['Content-Type'],
		allowMethods: ['GET', 'POST'],
	}),
)

app.on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw))

app.get('/', (c) => {
	return c.text('Duffle.')
})
