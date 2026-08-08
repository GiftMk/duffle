import { createMiddleware } from '@tanstack/react-start'
import { getDb } from '@/db'

export const withDb = createMiddleware({ type: 'function' }).server(
	async ({ next }) => {
		const db = await getDb()
		return next({ context: { db } })
	},
)
