import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/db'
import * as schema from '@/db/schema.auth'
import { env } from '@/env'
import { createMiddleware } from 'hono/factory'

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema,
	}),
	trustedOrigins: [env.WEB_URL],
	socialProviders: {
		github: {
			clientId: env.GITHUB_CLIENT_ID as string,
			clientSecret: env.GITHUB_CLIENT_SECRET as string,
		},
	},
})

type AuthSession = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>

export type RequestEnv = {
	Variables: {
		user: AuthSession['user']
	}
}

export const requireAuth = createMiddleware<{
	Variables: { user: AuthSession['user'] }
}>(async (c, next) => {
	const session = await auth.api.getSession({ headers: c.req.raw.headers })

	if (!session) {
		return c.json({ error: 'unauthorized' }, 401)
	}

	c.set('user', session.user)
	await next()
})
