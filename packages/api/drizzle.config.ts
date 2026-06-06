import { defineConfig } from 'drizzle-kit'
import { env } from './src/environment'

export default defineConfig({
	dialect: 'postgresql',
	schema: './src/db/schema.ts',
	casing: 'snake_case',
	dbCredentials: {
		url: env.DATABASE_URL,
	},
})
