import { Dexie, type EntityTable } from 'dexie'

export type ColumnEntity = {
	id: string
	title: string
	order: number
	cardIds: string[]
}

export type TaskEntity = {
	id: string
	title: string
	description?: string
	createdAt: string
}

export const db = new Dexie('duffle-db') as Dexie & {
	columns: EntityTable<ColumnEntity, 'id'>
	tasks: EntityTable<TaskEntity, 'id'>
}

db.version(4).stores({
	columns: 'id, order',
	tasks: 'id, createdAt',
})
