import Elysia, { InternalServerError } from 'elysia'
import z from 'zod'
import { db } from '../db'
import { documents } from '../db/schema'
import { stripMarkdown } from '../lib/strip-markdown'
import type { Document, Transactional } from './types'
import { documentProjection, toDto, txIdProjection } from './types'

export const createDocument = new Elysia().post(
	'/create',
	async ({
		body: { id, markdown, createdAt },
	}): Promise<Transactional<Document>> => {
		try {
			const text = stripMarkdown(markdown)

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
				throw new InternalServerError(
					'Something went wrong when creating the document.',
				)
			}

			return {
				...toDto(entity),
				txid: entity.txid,
			}
		} catch (e) {
			console.error(e)
			throw e
		}
	},
	{
		body: z.object({
			id: z.uuidv7(),
			markdown: z.string(),
			createdAt: z.iso.datetime(),
		}),
	},
)
