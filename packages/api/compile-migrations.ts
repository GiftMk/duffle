import { join } from 'node:path'
import { readMigrationFiles } from 'drizzle-orm/migrator'

const migrations = readMigrationFiles({ migrationsFolder: './drizzle/' })

await Bun.write(
	join(import.meta.dir, './src/db/__migrations__.json'),
	JSON.stringify(migrations),
)

console.log('Migrations compiled!')
