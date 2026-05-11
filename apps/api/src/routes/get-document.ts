import { eq } from 'drizzle-orm'
import Elysia, { NotFoundError } from 'elysia'
import z from 'zod'
import { db } from '../db'
import { documents } from '../db/schema'
import type { Document } from './types'
import { documentProjection, toDto } from './types'

export const getDocument = new Elysia().get(
	'/:id',
	async ({ params: { id } }): Promise<Document> => {
		const response = await db
			.select(documentProjection)
			.from(documents)
			.where(eq(documents.id, id))
			.limit(1)

		const document = response[0]

		if (!document) {
			throw new NotFoundError(`Note not found with id: '${id}'`)
		}

		return toDto(document)
	},
	{
		params: z.object({
			id: z.uuidv7(),
		}),
	},
)
