import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PGlite } from '@electric-sql/pglite'
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

const createPgliteDb = async (dataDir?: string): Promise<Database> => {
	const client = new PGlite(dataDir)
	const db = drizzlePglite({ client })
	await migratePglite(db, { migrationsFolder })
	return db
}

export const createDb = async (): Promise<Database> => {
	return createPostgresDb()
	throw new Error('Why are you tring to creae PG lite')
	// if (env.NODE_ENV === 'test') return createPgliteDb()
	// return createPgliteDb(devDataDir)
}

let dbPromise: Promise<Database> | undefined

export const getDb = (): Promise<Database> => {
	dbPromise ??= createDb()
	return dbPromise
}
