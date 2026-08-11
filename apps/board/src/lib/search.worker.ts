import { expose } from 'comlink'
import MiniSearch from 'minisearch'

export type SearchItemType = 'task' | 'board'

export type SearchItem = {
	id: string
	title: string
	body: string
	type: SearchItemType
	boardId?: string
}

export type SearchResult = Pick<SearchItem, 'id' | 'title' | 'type' | 'boardId'>

const miniSearch = new MiniSearch<SearchItem>({
	fields: ['title', 'body'],
	storeFields: ['title', 'type', 'boardId'],
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
			boardId: result.boardId,
		}))
	},

	clear() {
		miniSearch.removeAll()
		return miniSearch.documentCount
	},
}

export type SearchWorker = typeof api

expose(api)
