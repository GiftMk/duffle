import { sql } from 'drizzle-orm'
import z from 'zod'
import { documents } from '../db/schema'

export const documentProjection = {
	id: documents.id,
	markdown: documents.markdown,
	createdAt: documents.createdAt,
	updatedAt: documents.updatedAt,
}

export const txIdProjection = sql<number>`pg_current_xact_id()::xid::text::int`

type DocumentEntity = typeof documents.$inferSelect

export const toDto = (
	document: Omit<DocumentEntity, 'text' | 'searchVector'>,
): Document => ({
	id: document.id,
	markdown: document.markdown,
	createdAt: document.createdAt,
	updatedAt: document.updatedAt,
})

const datetimeSchema = z
	.string()
	.transform((s) => (s.includes('T') ? s : `${s.replace(' ', 'T')}Z`))
	.pipe(z.iso.datetime())

export const documentSchema = z.object({
	id: z.uuidv7(),
	markdown: z.string().min(1),
	createdAt: datetimeSchema,
	updatedAt: datetimeSchema.nullable().optional(),
})

export type Transactional<T> = T & {
	txid: number
}

export type Document = z.infer<typeof documentSchema>
