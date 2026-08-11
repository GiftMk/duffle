import { getDb } from '@duffle/db'
import { createMiddleware } from '@tanstack/react-start'

export const withDb = createMiddleware({ type: 'function' }).server(
	async ({ next }) => {
		const db = await getDb()
		return next({ context: { db } })
	},
)
