import { eq } from 'drizzle-orm'
import z from 'zod'
import type { Database } from '../db'
import { documents } from '../db/schema'
import type { Document } from './types'
import { documentProjection } from './types'
import { toModel } from './utils'

export const getDocument = async (
	db: Database,
	id: string,
): Promise<Document> => {
	z.uuidv7().parse(id)

	const response = await db
		.select(documentProjection)
		.from(documents)
		.where(eq(documents.id, id))
		.limit(1)

	const document = response[0]

	if (!document) {
		throw new Error(`Note not found with id: '${id}'`)
	}

	return toModel(document)
}
