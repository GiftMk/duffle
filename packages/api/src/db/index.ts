import { drizzle } from 'drizzle-orm/pglite'
import { PGlite } from '@electric-sql/pglite'
import { vector } from '@electric-sql/pglite-pgvector'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { migrate } from 'drizzle-orm/pglite/migrator'
import { env } from '../../environment'

const client = new PGlite(env.DATABASE_URL, {
	extensions: { vector },
})

export const db = drizzle({ client, casing: 'snake_case' })

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const migrationsFolder = path.join(__dirname, '../../drizzle')

export const runMigrations = async () => migrate(db, { migrationsFolder })
