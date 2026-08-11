import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import type { Database } from './index'
import * as schema from './schema.auth'

type CreateAuthOptions = {
	db: Database
	baseURL: string
	secret: string
	githubClientId: string
	githubClientSecret: string
	/**
	 * Set to the apex domain (e.g. `.duffle.dev`) in production so a session
	 * created on one subdomain app is valid on the other. Leave undefined in
	 * local dev, where apps run on different localhost ports and can't share
	 * a subdomain-scoped cookie anyway.
	 */
	crossSubDomainCookieDomain?: string
}

export const createAuth = ({
	db,
	baseURL,
	secret,
	githubClientId,
	githubClientSecret,
	crossSubDomainCookieDomain,
}: CreateAuthOptions) =>
	betterAuth({
		database: drizzleAdapter(db, {
			provider: 'pg',
			schema,
		}),
		baseURL,
		secret,
		socialProviders: {
			github: {
				clientId: githubClientId,
				clientSecret: githubClientSecret,
			},
		},
		advanced: crossSubDomainCookieDomain
			? {
					crossSubDomainCookies: {
						enabled: true,
						domain: crossSubDomainCookieDomain,
					},
				}
			: undefined,
		plugins: [tanstackStartCookies()], // must be the last plugin
	})
