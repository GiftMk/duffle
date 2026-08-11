import { integer, snakeCase, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { userReference } from './schema.auth'

export const kanbanSchema = snakeCase.schema('kanban')

export const boardsTable = kanbanSchema.table('boards', {
	id: uuid().primaryKey(),
	userId: userReference(),
	title: text().notNull(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
	updatedAt: timestamp({ mode: 'string' }).notNull(),
})

export const columnsTable = kanbanSchema.table('columns', {
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

export const tasksTable = kanbanSchema.table('tasks', {
	id: uuid().primaryKey(),
	userId: userReference(),
	columnId: uuid()
		.notNull()
		.references(() => columnsTable.id, { onDelete: 'cascade' }),
	title: text().notNull(),
	description: text(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
	updatedAt: timestamp({ mode: 'string' }).notNull(),
	position: text().notNull(),
})
