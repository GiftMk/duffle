import { expose } from 'comlink'
import MiniSearch from 'minisearch'

export type SearchItem = {
	id: string
	title: string
	body: string
}

export type SearchResult = Pick<SearchItem, 'id' | 'title'>

const miniSearch = new MiniSearch<SearchItem>({
	fields: ['title', 'body'],
	storeFields: ['title'],
	searchOptions: {
		fuzzy: true,
		prefix: true,
		boost: { title: 2 },
	},
})

const api = {
	add(items: SearchItem[]) {
		for (const item of items) {
			if (miniSearch.has(item.id)) {
				miniSearch.replace(item)
			} else {
				miniSearch.add(item)
			}
		}
		return miniSearch.documentCount
	},

	query(query: string): SearchResult[] {
		return miniSearch.search(query).map((result) => ({
			id: result.id,
			title: result.title,
		}))
	},
}

export type SearchWorker = typeof api

expose(api)
