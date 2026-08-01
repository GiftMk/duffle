import { expose } from 'comlink'
import MiniSearch from 'minisearch'
import type { BoardCard } from '@/lib/db'

export type SearchItem = Pick<BoardCard, 'id' | 'title'>

const miniSearch = new MiniSearch<SearchItem>({
	fields: ['title'],
	storeFields: ['title'],
	searchOptions: {
		fuzzy: true,
	},
})

const api = {
	add(cards: SearchItem[]) {
		miniSearch.addAll(cards)
		return miniSearch.documentCount
	},

	update(cards: SearchItem[]) {
		for (const card of cards) {
			miniSearch.replace(card)
		}
		return miniSearch.documentCount
	},

	query(query: string): SearchItem[] {
		return miniSearch.search(query).map((result) => ({
			id: result.id,
			title: result.title,
		}))
	},

	clear() {
		miniSearch.removeAll()
		return miniSearch.documentCount
	},
}

export type SearchWorker = typeof api

expose(api)
