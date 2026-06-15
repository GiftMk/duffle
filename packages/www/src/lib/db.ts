import { createDb, type Database, runMigrations } from '@duffle/api'
import { createAtom } from '@xstate/store'
import { env } from '../../environment'

export const dbAtom = createAtom<Database | null>(null)

export const database = () => {
	const value = dbAtom.get()

	if (!value) {
		throw new Error('In memory db is not initialised.')
	}

	return value
}

export const initDb = async () => {
	if (dbAtom.get()) {
		console.debug('Skipping in-memory db creation')
		return
	}

	const db = createDb(`idb://${env.VITE_DB_URL}`)
	console.debug('Created in-memory db')

	await runMigrations(db)
	console.debug('Ran migrations')

	dbAtom.set(db)
	console.debug('Initialized in-memory db')
}
