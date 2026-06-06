import { createEnv } from '@t3-oss/env-core'
import z from 'zod'

export const env = createEnv({
	server: {
		DATABASE_URL: z.url(),
		PORT: z.number().default(3000),
	},
	runtimeEnv: process.env,
})
