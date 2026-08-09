import { sql } from 'drizzle-orm'
import {
	index,
	snakeCase,
	text,
	timestamp,
	uuid,
	vector,
} from 'drizzle-orm/pg-core'
import { userReference } from './schema.kanban'
import { tsvector } from './types'

export const notesTable = snakeCase.table(
	'notes',
	{
		id: uuid().primaryKey(),
		userId: userReference(),
		title: text().notNull(),
		body: text().notNull(),
		markdown: text().notNull(),
		searchVector: tsvector().generatedAlwaysAs(
			sql`setweight(to_tsvector('english', coalesce(title, '')), 'A') || setweight(to_tsvector('english', coalesce(body, '')), 'B')`,
		),
		embedding: vector('embedding', { dimensions: 512 }),
		createdAt: timestamp({ mode: 'string' }).notNull(),
		updatedAt: timestamp({ mode: 'string' }).notNull(),
	},
	(table) => [
		index('notes_title_trgm_idx').using('gin', table.title.op('gin_trgm_ops')),
		index('notes_search_vector_idx').using('gin', table.searchVector),
		index('notes_embedding_hnsw_idx')
			.using('hnsw', table.embedding.op('vector_cosine_ops'))
			.where(sql`embedding IS NOT NULL`),
	],
)
