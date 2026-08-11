import { snakeCase, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { userReference } from './schema.auth'

export const notesSchema = snakeCase.schema('notes')

export const notesTable = notesSchema.table('notes', {
	id: uuid().primaryKey(),
	userId: userReference(),
	title: text().notNull(),
	body: text().notNull(),
	markdown: text().notNull(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
	updatedAt: timestamp({ mode: 'string' }).notNull(),
})
