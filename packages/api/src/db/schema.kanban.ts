import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { usersTable } from './schema.auth'

const userReference = () =>
	text()
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade' })

export const boardsTable = pgTable('boards', {
	id: uuid().primaryKey(),
	userId: userReference(),
	title: text().notNull(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
	updatedAt: timestamp({ mode: 'string' }).notNull(),
})

export const columnsTable = pgTable('columns', {
	id: uuid().primaryKey(),
	userId: userReference(),
	boardId: uuid().references(() => boardsTable.id, { onDelete: 'cascade' }),
	title: text().notNull(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
	updatedAt: timestamp({ mode: 'string' }).notNull(),
	position: integer().notNull(),
})

export const tasksTable = pgTable('tasks', {
	id: uuid().primaryKey(),
	userId: userReference(),
	columnId: uuid().references(() => columnsTable.id, { onDelete: 'cascade' }),
	title: text().notNull(),
	description: text(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
	updatedAt: timestamp({ mode: 'string' }).notNull(),
	position: integer().notNull(),
})
