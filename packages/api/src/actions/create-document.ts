import z from 'zod'
import type { Database } from '../db'
import { documents } from '../db/schema'
import type { Document, Transactional } from './types'
import { documentProjection, txIdProjection } from './types'
import { stripMd, toModel } from './utils'

const inputSchema = z.object({
	id: z.uuidv7(),
	markdown: z.string(),
	createdAt: z.iso.datetime(),
})

export const createDocument = async (
	db: Database,
	input: z.infer<typeof inputSchema>,
): Promise<Transactional<Document>> => {
	try {
		const { id, markdown, createdAt } = inputSchema.parse(input)
		const text = stripMd(markdown)

		const response = await db.transaction(async (tx) =>
			tx
				.insert(documents)
				.values({ id, markdown, text, createdAt })
				.returning({
					...documentProjection,
					txid: txIdProjection,
				}),
		)

		const entity = response[0]

		if (!entity) {
			throw new Error('Something went wrong when creating the document.')
		}

		return {
			...toModel(entity),
			txid: entity.txid,
		}
	} catch (e) {
		console.error(e)
		throw e
	}
}
