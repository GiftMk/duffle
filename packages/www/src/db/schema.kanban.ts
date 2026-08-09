import { sql } from 'drizzle-orm'
import {
	index,
	integer,
	snakeCase,
	text,
	timestamp,
	uuid,
	vector,
} from 'drizzle-orm/pg-core'
import { user } from './schema.auth'
import { tsvector } from './types'

export const userReference = () =>
	text()
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' })

export const boardsTable = snakeCase.table('boards', {
	id: uuid().primaryKey(),
	userId: userReference(),
	title: text().notNull(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
	updatedAt: timestamp({ mode: 'string' }).notNull(),
})

export const columnsTable = snakeCase.table('columns', {
	id: uuid().primaryKey(),
	userId: userReference(),
	boardId: uuid()
		.notNull()
		.references(() => boardsTable.id, { onDelete: 'cascade' }),
	title: text().notNull(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
	updatedAt: timestamp({ mode: 'string' }).notNull(),
	position: integer().notNull(),
})

export const tasksTable = snakeCase.table(
	'tasks',
	{
		id: uuid().primaryKey(),
		userId: userReference(),
		columnId: uuid()
			.notNull()
			.references(() => columnsTable.id, { onDelete: 'cascade' }),
		title: text().notNull(),
		description: text(),
		searchVector: tsvector().generatedAlwaysAs(
			sql`setweight(to_tsvector('english', coalesce(title, '')), 'A') || setweight(to_tsvector('english', coalesce(description, '')), 'B')`,
		),
		embedding: vector('embedding', { dimensions: 512 }),
		createdAt: timestamp({ mode: 'string' }).notNull(),
		updatedAt: timestamp({ mode: 'string' }).notNull(),
		position: text().notNull(),
	},
	(table) => [
		index('tasks_title_trgm_idx').using('gin', table.title.op('gin_trgm_ops')),
		index('tasks_search_vector_idx').using('gin', table.searchVector),
		index('tasks_embedding_hnsw_idx')
			.using('hnsw', table.embedding.op('vector_cosine_ops'))
			.where(sql`embedding IS NOT NULL`),
	],
)
