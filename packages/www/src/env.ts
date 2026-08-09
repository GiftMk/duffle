import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
	clientPrefix: 'VITE_',
	client: {},
	server: {
		NODE_ENV: z
			.enum(['development', 'test', 'production'])
			.default('development'),
		DATABASE_URL: z.url().optional(),
		GITHUB_CLIENT_ID: z.string(),
		GITHUB_CLIENT_SECRET: z.string(),
		BETTER_AUTH_URL: z.url(),
		BETTER_AUTH_SECRET: z.string(),
		OPENAI_API_KEY: z.string(),
	},
	runtimeEnv: process.env,
	skipValidation: process.env.CI === 'true' || process.env.NODE_ENV === 'test',
})
