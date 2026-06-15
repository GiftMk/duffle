import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	dialect: 'postgresql',
	driver: 'pglite',
	schema: './src/db/schema.ts',
	casing: 'snake_case',
	dbCredentials: {
		url: '.pglite',
	},
})
