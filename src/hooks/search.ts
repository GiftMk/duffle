import { useEffect, useState } from 'react'
import { useNotes } from '@/hooks/notes'
import type { NoteEntity } from '@/lib/schemas'
import { noteToSearchItem, searchWorker } from '@/lib/search'
import type { SearchResult } from '@/lib/search.worker'

export const useSearch = () => {
	const [query, setQuery] = useState('')
	const [results, setResults] = useState<SearchResult[]>([])
	const [isSearching, setIsSearching] = useState(false)

	useEffect(() => {
		if (!query.length) {
			setResults([])
			setIsSearching(false)
			return
		}

		setIsSearching(true)
		searchWorker.query(query).then((queryResults) => {
			setResults(queryResults)
			setIsSearching(false)
		})
	}, [query])

	const clear = () => {
		setQuery('')
		setResults([])
	}

	return { query, setQuery, results, isSearching, clear }
}

export const useRecentSearchResults = (limit: number): SearchResult[] => {
	const notes = useNotes()

	const recent = takeMostRecent(notes, limit)

	return recent.map(noteToSearchItem)
}

const takeMostRecent = (notes: NoteEntity[], limit: number): NoteEntity[] => {
	return [...notes]
		.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
		.slice(0, limit)
}
