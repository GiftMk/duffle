import { defineConfig } from 'drizzle-kit'
import { env } from './src/env'

if (!env.DATABASE_URL) {
	throw new Error(
		'DATABASE_URL is required to run drizzle-kit commands. Set it in your environment (e.g. pointed at a remote/staging Postgres).',
	)
}

export default defineConfig({
	dialect: 'postgresql',
	schema: './src/schema.*.ts',
	out: './drizzle',
	dbCredentials: {
		url: env.DATABASE_URL,
	},
})
