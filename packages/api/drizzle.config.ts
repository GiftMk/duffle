import { defineConfig } from 'drizzle-kit'
import { env } from './environment'

export default defineConfig({
	dialect: 'postgresql',
	driver: 'pglite',
	schema: './src/db/schema.ts',
	casing: 'snake_case',
	dbCredentials: {
		url: env.DATABASE_URL,
	},
})
