import { getDb } from '@/db'
import { createAuth } from '@/db/auth'
import { env } from '@/env'

const db = await getDb()

export const auth = createAuth({
	db,
	baseURL: env.BETTER_AUTH_URL,
	secret: env.BETTER_AUTH_SECRET,
	githubClientId: env.GITHUB_CLIENT_ID,
	githubClientSecret: env.GITHUB_CLIENT_SECRET,
	crossSubDomainCookieDomain:
		env.NODE_ENV === 'production' ? '.duffle.dev' : undefined,
})
