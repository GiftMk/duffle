import type { Database } from '../db'
import { documents } from '../db/schema'
import { documentProjection } from './types'

export const getDocuments = (db: Database) => {
	return db.select(documentProjection).from(documents)
}
