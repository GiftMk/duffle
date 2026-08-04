import type { AppType } from '@duffle/api'
import { hc } from 'hono/client'
import { env } from '@/env'

export const client = hc<AppType>(env.VITE_API_URL, {
	init: { credentials: 'include' },
})
