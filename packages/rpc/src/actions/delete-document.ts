import { eq } from 'drizzle-orm'
import z from 'zod'
import type { Database } from '../db'
import { documents } from '../db/schema'
import {
	type Document,
	documentProjection,
	type Transactional,
	txIdProjection,
} from './types'
import { toModel } from './utils'

export const deleteDocument = async (
	db: Database,
	id: string,
): Promise<Transactional<Document>> => {
	z.uuidv7().parse(id)

	const result = await db
		.delete(documents)
		.where(eq(documents.id, id))
		.returning({ ...documentProjection, txid: txIdProjection })

	if (!result[0]) {
		throw new Error(`Document ${id} not found.`)
	}

	const entity = result[0]
	return { ...toModel(entity), txid: entity.txid }
}
