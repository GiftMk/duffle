import type { Database } from '@/db'
import { test as baseTest } from 'vitest'
import { getTestDb } from './setup'

const { db } = await getTestDb()

type Fixtures = {
	db: Database
}

const ROLLBACK_ERROR = new Error('Fixture Rollback')

export const dbTest = baseTest.extend<Fixtures>({
	// biome-ignore lint/correctness/noEmptyPattern: needed by vitest
	db: async ({}, use) => {
		try {
			await db.transaction(async (tx) => {
				await use(tx)

				throw ROLLBACK_ERROR
			})
		} catch (e) {
			if (e !== ROLLBACK_ERROR) {
				throw e
			}
		}
	},
})
