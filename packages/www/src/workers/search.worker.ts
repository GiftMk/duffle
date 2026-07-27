import { expose } from 'comlink'
import MiniSearch from 'minisearch'
import type { Note } from '@/lib/db'

export type SearchItem = Pick<Note, 'id' | 'title' | 'body'>

const miniSearch = new MiniSearch<SearchItem>({
	fields: ['title', 'body'],
	storeFields: ['title', 'body'],
	searchOptions: {
		fuzzy: true,
		boost: { title: 2 },
	},
})

const api = {
	add(notes: SearchItem[]) {
		miniSearch.addAll(notes)
		return miniSearch.documentCount
	},

	update(notes: SearchItem[]) {
		for (const note of notes) {
			miniSearch.replace(note)
		}
		return miniSearch.documentCount
	},

	query(query: string): SearchItem[] {
		return miniSearch.search(query).map((result) => ({
			id: result.id,
			title: result.title,
			body: result.body,
		}))
	},
}

export type SearchWorker = typeof api

expose(api)
