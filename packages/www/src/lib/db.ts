import { createDb, runMigrations } from '@duffle/api'
import { env } from '../../environment'

export const db = createDb(`idb://${env.VITE_DB_URL}`)

export const initDb = async () => {
	console.debug('Created in-memory db')

	await runMigrations(db)
	console.debug('Ran migrations')

	console.debug('Initialized in-memory db')
}
