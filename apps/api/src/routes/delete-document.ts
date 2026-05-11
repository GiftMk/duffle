import { eq } from 'drizzle-orm'
import Elysia, { NotFoundError } from 'elysia'
import z from 'zod'
import { db } from '../db'
import { documents } from '../db/schema'
import {
	type Document,
	documentProjection,
	type Transactional,
	toDto,
	txIdProjection,
} from './types'

export const deleteDocument = new Elysia().delete(
	'/:id',
	async ({ params: { id } }): Promise<Transactional<Document>> => {
		const result = await db
			.delete(documents)
			.where(eq(documents.id, id))
			.returning({ ...documentProjection, txid: txIdProjection })

		if (!result[0]) {
			throw new NotFoundError(`Document ${id} not found.`)
		}

		const entity = result[0]
		return { ...toDto(entity), txid: entity.txid }
	},
	{
		params: z.object({
			id: z.uuidv7(),
		}),
	},
)
