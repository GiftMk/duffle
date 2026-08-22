import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PGlite } from '@electric-sql/pglite'
import { pg_trgm } from '@electric-sql/pglite/contrib/pg_trgm'
import {
	drizzle as drizzleNodePostgres,
	type NodePgDatabase,
} from 'drizzle-orm/node-postgres'
import {
	drizzle as drizzlePglite,
	type PgliteDatabase,
} from 'drizzle-orm/pglite'
import { migrate as migratePglite } from 'drizzle-orm/pglite/migrator'
import { Pool } from 'pg'
import { env } from '@/env'

export type Database = NodePgDatabase | PgliteDatabase

const createPostgresDb = (): Database => {
	if (!env.DATABASE_URL) {
		throw new Error('DATABASE_URL is required when NODE_ENV=production.')
	}
	const pool = new Pool({ connectionString: env.DATABASE_URL })
	return drizzleNodePostgres({ client: pool })
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const migrationsFolder = path.join(__dirname, '../../drizzle')
const devDataDir = path.join(__dirname, '../../.pglite')

export type TestDbContext = { db: Database; dispose: () => Promise<void> }

export const createPgliteDb = async (
	dataDir?: string,
): Promise<TestDbContext> => {
	const client = new PGlite(dataDir, { extensions: { pg_trgm } })
	const db = drizzlePglite({ client })
	await migratePglite(db, { migrationsFolder })
	return {
		db,
		dispose: async () => {
			await client.close()
		},
	}
}

export const createDb = async (): Promise<Database> => {
	if (env.NODE_ENV === 'development') {
		const { db } = await createPgliteDb(devDataDir)
		return db
	}

	return createPostgresDb()
}

let dbPromise: Promise<Database> | undefined

export const getDb = (): Promise<Database> => {
	dbPromise ??= createDb()
	return dbPromise
}
