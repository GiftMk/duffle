import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { bearer } from 'better-auth/plugins'
import { db } from '../db/index.js'
import * as schema from '../db/schema.auth.js'
import { env } from '../env.js'
import { createMiddleware } from 'hono/factory'

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema,
	}),
	trustedOrigins: [env.WEB_URL],
	plugins: [bearer()],
	account: {
		// The state cookie set during `signIn.social()` is a third-party cookie here
		// (www calls api cross-origin), so it never survives the GitHub round trip.
		// The DB-backed verification record (still checked) is the real CSRF defense.
		skipStateCookieCheck: true,
	},
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
