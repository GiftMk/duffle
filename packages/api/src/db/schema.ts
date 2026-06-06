import { type SQL, sql } from 'drizzle-orm'
import { index, pgTable } from 'drizzle-orm/pg-core'
import { customType } from 'drizzle-orm/pg-core'

export const documents = pgTable(
	'documents',
	(t) => ({
		id: t.uuid().primaryKey(),
		markdown: t.text().notNull(),
		text: t.text().notNull(),
		searchVector: tsvector().generatedAlwaysAs(
			(): SQL => sql`to_tsvector('english', ${documents.text})`,
		),
		createdAt: t.timestamp({ mode: 'string' }).notNull(),
		updatedAt: t.timestamp({ mode: 'string' }),
	}),
	(t) => [index('documents_text_fts').using('gin', t.searchVector)],
)

export const tsvector = customType<{ data: string }>({
	dataType: () => 'tsvector',
})
