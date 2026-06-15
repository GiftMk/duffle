import { PGlite } from '@electric-sql/pglite'
import { vector } from '@electric-sql/pglite-pgvector'
import type { MigrationConfig } from 'drizzle-orm/migrator'
import { drizzle, type PgliteDatabase } from 'drizzle-orm/pglite'
import migrations from './__migrations__.json'

export const createDb = (url: string) => {
	const client = new PGlite(url, {
		extensions: { vector },
	})

	const db = drizzle({ client, casing: 'snake_case' })

	return db
}

export type Database = ReturnType<typeof createDb>

export const runMigrations = async (db: PgliteDatabase) => {
	if (!('dialect' in db) || !('session' in db)) {
		throw new Error('Failed to run db migrations.')
	}

	// biome-ignore lint/suspicious/noExplicitAny: using hidden API to support client-side migrations
	await (db.dialect as any).migrate(migrations, db.session, {
		migrationsTable: 'drizzle_migrations',
	} satisfies Omit<MigrationConfig, 'migrationsFolder'>)
}
