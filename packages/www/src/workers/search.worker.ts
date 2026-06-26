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

export type SearchRequest =
	| {
			type: 'add'
			payload: SearchItem[]
	  }
	| {
			type: 'update'
			payload: SearchItem[]
	  }
	| {
			type: 'query'
			payload: string
	  }

export type SearchResponse =
	| {
			type: 'add'
			payload: number
	  }
	| {
			type: 'update'
			payload: number
	  }
	| {
			type: 'query'
			payload: SearchItem[]
	  }

self.onmessage = (e: MessageEvent<SearchRequest>) => {
	switch (e.data.type) {
		case 'add': {
			const notes = e.data.payload
			miniSearch.addAll(notes)
			reply({ type: 'add', payload: miniSearch.documentCount })
			break
		}
		case 'update': {
			const notes = e.data.payload

			for (const note of notes) {
				miniSearch.replace(note)
			}

			reply({ type: 'update', payload: miniSearch.documentCount })
			break
		}
		case 'query': {
			const query = e.data.payload
			const results = miniSearch.search(query)
			// biome-ignore lint/suspicious/noExplicitAny: minisearch returns items as any
			reply({ type: 'query', payload: results as any as SearchItem[] })
		}
	}
}

const reply = (response: SearchResponse) => {
	self.postMessage(response)
}
