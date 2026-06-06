import { eq } from 'drizzle-orm'
import Elysia, { InternalServerError } from 'elysia'
import z from 'zod'
import { db } from '../db'
import { documents } from '../db/schema'
import { stripMarkdown } from '../lib/utils'
import {
	type Document,
	documentProjection,
	type Transactional,
	toDto,
	txIdProjection,
} from './types'

export const updateDocument = new Elysia().put(
	'/update',
	async ({
		body: { id, markdown, updatedAt },
	}): Promise<Transactional<Document>> => {
		const text = stripMarkdown(markdown)

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
			throw new InternalServerError(
				'Something went wrong when creating the document.',
			)
		}

		return { ...toDto(entity), txid: entity.txid }
	},
	{
		body: z.object({
			id: z.uuidv7(),
			markdown: z.string(),
			updatedAt: z.iso.datetime(),
		}),
	},
)
