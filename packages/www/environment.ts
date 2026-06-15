import { createEnv } from '@t3-oss/env-core'
import z from 'zod'

export const env = createEnv({
	clientPrefix: 'VITE_',
	client: {
		VITE_DB_URL: z.string().default('duffle-pglite'),
	},
	runtimeEnv: import.meta.env,
})
