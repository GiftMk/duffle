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
import { stripMd, toModel } from './utils'

const inputSchema = z.object({
	id: z.uuidv7(),
	markdown: z.string(),
	updatedAt: z.iso.datetime(),
})

export const updateDocument = async (
	db: Database,
	input: z.infer<typeof inputSchema>,
): Promise<Transactional<Document>> => {
	const { markdown, updatedAt, id } = inputSchema.parse(input)

	const text = stripMd(markdown)

	const response = await db
		.update(documents)
		.set({ markdown, text, updatedAt })
		.where(eq(documents.id, id))
		.returning({
			...documentProjection,
			txid: txIdProjection,
		})

	const entity = response[0]

	if (!entity) {
		throw new Error('Something went wrong when creating the document.')
	}

	return { ...toModel(entity), txid: entity.txid }
}
