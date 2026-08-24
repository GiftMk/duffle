import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { anonymous } from 'better-auth/plugins'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import {
	deleteNotesForUserQuery,
	reassignNotesQuery,
} from '@/server/notes.server'
import type { Database } from './index'
import * as schema from './schema.auth'

type CreateAuthOptions = {
	db: Database
	baseURL: string
	secret: string
	githubClientId: string
	githubClientSecret: string
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
		plugins: [
			anonymous({
				onLinkAccount: async ({ anonymousUser, newUser }) => {
					await reassignNotesQuery(db, anonymousUser.user.id, newUser.user.id)
					await deleteNotesForUserQuery(db, anonymousUser.user.id)
				},
			}),
			tanstackStartCookies(), // must be the last plugin
		],
	})
