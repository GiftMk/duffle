import type { AppType } from '@duffle/api'
import { hc } from 'hono/client'
import { env } from '@/env'

const TOKEN_KEY = 'duffle_bearer_token'

export const client = hc<AppType>(env.VITE_API_URL, {
	headers: () => {
		const token = localStorage.getItem(TOKEN_KEY)
		return { Authorization: token ? `Bearer ${token}` : '' }
	},
})
