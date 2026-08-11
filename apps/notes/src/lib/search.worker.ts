import { expose } from 'comlink'
import MiniSearch from 'minisearch'

export type SearchItemType = 'note'

export type SearchItem = {
	id: string
	title: string
	body: string
	type: SearchItemType
}

export type SearchResult = Pick<SearchItem, 'id' | 'title' | 'type'>

const miniSearch = new MiniSearch<SearchItem>({
	fields: ['title', 'body'],
	storeFields: ['title', 'type'],
	searchOptions: {
		fuzzy: true,
		prefix: true,
		boost: { title: 2 },
	},
})

const upsert = (items: SearchItem[]) => {
	for (const item of items) {
		if (miniSearch.has(item.id)) {
			miniSearch.replace(item)
		} else {
			miniSearch.add(item)
		}
	}
	return miniSearch.documentCount
}

const api = {
	add(items: SearchItem[]) {
		return upsert(items)
	},

	update(items: SearchItem[]) {
		return upsert(items)
	},

	query(query: string): SearchResult[] {
		return miniSearch.search(query).map((result) => ({
			id: result.id,
			title: result.title,
			type: result.type,
		}))
	},

	clear() {
		miniSearch.removeAll()
		return miniSearch.documentCount
	},
}

export type SearchWorker = typeof api

expose(api)
