import { Dexie, type EntityTable } from 'dexie'

export type Note = {
	id: string
	title: string
	body: string
	markdown: string
	createdAt: string
	updatedAt?: string
}

export type BoardColumn = {
	id: string
	title: string
	order: number
	cardIds: string[]
}

export type BoardCard = {
	id: string
	title: string
	description?: string
	createdAt: string
}

// `notes` stays on the type even though the object store below is dropped in
// version 3 - `lib/actions.ts#updateNote` still references it and is
// unreachable dead code until the editor is wired back up, so keeping the
// type avoids touching that file for no gain.
export const db = new Dexie('duffle-db') as Dexie & {
	notes: EntityTable<Note, 'id'>
	boardColumns: EntityTable<BoardColumn, 'id'>
	boardCards: EntityTable<BoardCard, 'id'>
}

db.version(1).stores({
	notes: '++id, markdown, createdAt, updatedAt',
})

db.version(2).stores({
	notes: '++id, markdown, createdAt, updatedAt',
	boardColumns: 'id, order',
	boardCards: 'id, createdAt',
})

db.version(3).stores({
	notes: null,
	boardColumns: 'id, order',
	boardCards: 'id, createdAt',
})
