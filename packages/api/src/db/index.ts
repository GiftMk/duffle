import { PGlite } from '@electric-sql/pglite'
import { vector } from '@electric-sql/pglite-pgvector'
import { drizzle } from 'drizzle-orm/pglite'
import migrations from './__migrations__.json'

export const createDb = (url: string) => {
	const client = new PGlite(url, {
		extensions: { vector },
	})

	const db = drizzle({ client, casing: 'snake_case' })

	return db
}

export type Database = ReturnType<typeof createDb>

/* MIGRATIONS */

async function ensureMigrationsTable(db: Database) {
	await db.execute(`
    CREATE TABLE IF NOT EXISTS drizzle_migrations (
      hash TEXT PRIMARY KEY,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `)
}

async function getMigratedHashes(db: Database): Promise<string[]> {
	const result = await db.execute(`
    SELECT hash FROM drizzle_migrations ORDER BY created_at ASC
  `)
	return result.rows.map((row) => row.hash as string)
}

async function recordMigration(db: Database, hash: string) {
	await db.execute(
		`
    INSERT INTO drizzle_migrations (hash, created_at)
    VALUES ('${hash}', NOW())
    ON CONFLICT DO NOTHING
  `,
	)
}

export async function runMigrations(db: Database) {
	console.log('🚀 Starting pglite migration...')

	// Ensure migrations table exists
	await ensureMigrationsTable(db)

	// Get already executed migrations
	const executedHashes = await getMigratedHashes(db)

	// Filter and execute pending migrations
	const pendingMigrations = migrations.filter(
		(migration) => !executedHashes.includes(migration.hash),
	)

	if (pendingMigrations.length === 0) {
		console.log('✨ No pending migrations found.')
		return
	}

	console.log(`📦 Found ${pendingMigrations.length} pending migrations`)

	// Execute migrations in sequence
	for (const migration of pendingMigrations) {
		console.log(`⚡ Executing migration: ${migration.hash}`)
		try {
			// Execute each SQL statement in sequence
			for (const sql of migration.sql) {
				await db.execute(sql)
			}

			// Record successful migration
			await recordMigration(db, migration.hash)
			console.log(`✅ Successfully completed migration: ${migration.hash}`)
		} catch (error) {
			console.error(`❌ Failed to execute migration ${migration.hash}:`, error)
			throw error
		}
	}

	console.log('🎉 All migrations completed successfully')
}

// export const runMigrations = async (db: PgliteDatabase) => {
// 	if (!('dialect' in db) || !('session' in db)) {
// 		throw new Error('Failed to run db migrations.')
// 	}

// 	await db.execute(`CREATE SCHEMA IF NOT EXISTS "public";`)
// 	// biome-ignore lint/suspicious/noExplicitAny: using hidden API to support client-side migrations
// 	await (db.dialect as any).migrate(migrations, db.session, {
// 		migrationsTable: 'drizzle_migrations',
// 	})
// }
