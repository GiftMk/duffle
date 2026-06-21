import { Dexie, type EntityTable } from 'dexie'
import MiniSearch from 'minisearch'

export type Note = {
	id: string
	title: string
	body: string
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

export type SearchItem = Pick<Note, 'id' | 'title' | 'body'>

export const miniSearch = new MiniSearch<SearchItem>({
	fields: ['title', 'body'],
	storeFields: ['title', 'body'],
	searchOptions: {
		boost: { title: 2 },
	},
})
