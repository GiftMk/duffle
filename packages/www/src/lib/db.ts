import { Dexie, type EntityTable } from 'dexie'

export type Note = {
	id: string
	markdown: string
	createdAt: string
	updatedAt?: string
}

export const db = new Dexie('duffle-db') as Dexie & {
	notes: EntityTable<Note, 'id'>
}

db.version(1).stores({
	notes: '++id, markdown, createdAt, updatedAt',
})
