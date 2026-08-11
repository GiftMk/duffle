import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
	server: {
		CI: z.boolean().default(false),
		NODE_ENV: z
			.enum(['development', 'test', 'production'])
			.default('development'),
		DATABASE_URL: z.url().optional(),
	},
	runtimeEnv: process.env,
	skipValidation: process.env.CI === 'true' || process.env.NODE_ENV === 'test',
})
