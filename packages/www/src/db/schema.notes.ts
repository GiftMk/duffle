import { snakeCase, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { userReference } from './schema.kanban'

export const notesTable = snakeCase.table('notes', {
	id: uuid().primaryKey(),
	userId: userReference(),
	title: text().notNull(),
	body: text().notNull(),
	markdown: text().notNull(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
	updatedAt: timestamp({ mode: 'string' }).notNull(),
})
