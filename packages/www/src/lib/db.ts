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
		return
	}

	const db = createDb(`idb://${env.VITE_DB_URL}`)
	await runMigrations(db)
	dbAtom.set(db)
}
