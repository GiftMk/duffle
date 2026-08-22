import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createPgliteDb, type TestDbContext } from '@/db'

let dbPromise: Promise<TestDbContext> | undefined

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const testDataDir = path.join(__dirname, '../.test-pglite')

export const getTestDb = (): Promise<TestDbContext> => {
	dbPromise ??= createPgliteDb(testDataDir)
	return dbPromise
}

export async function setup() {
	await getTestDb()
}

export async function teardown() {
	const { dispose } = await getTestDb()
	await dispose()
	fs.rmSync(testDataDir, { recursive: true, force: true })
}
