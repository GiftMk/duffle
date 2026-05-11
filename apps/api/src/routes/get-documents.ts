import { desc, sql } from 'drizzle-orm'
import Elysia from 'elysia'
import z from 'zod'
import { db } from '../db'
import { documents } from '../db/schema'
import { type Document, documentProjection, toDto } from './types'

export const getDocuments = new Elysia().get(
	'/',
	async ({ query: { q = '' } }): Promise<Document[]> => {
		if (!q.trim()) {
			const entities = await db.select(documentProjection).from(documents)
			return entities.map(toDto)
		}

		const tsquery = sql`websearch_to_tsquery('english', ${q})`
		const rank = sql<number>`ts_rank(${documents.searchVector}, ${tsquery})`

		const entities = await db
			.select({
				...documentProjection,
				rank,
			})
			.from(documents)
			.where(sql`${documents.searchVector} @@ ${tsquery}`)
			.orderBy((t) => desc(t.rank))

		return entities.map(toDto)
	},
	{
		query: z
			.object({
				q: z.string().optional(),
			})
			.optional(),
	},
)
