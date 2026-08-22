import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useNotes } from '@/hooks/notes'
import type { NoteEntity } from '@/lib/schemas'
import { searchFn } from '@/server/notes.functions'
import { useDebounce } from './use-debounce'

export const useSearch = () => {
	const [query, setQuery] = useState('')
	const debouncedQuery = useDebounce(query, 250)

	const { data, isFetching } = useQuery({
		queryKey: ['search', debouncedQuery],
		queryFn: () => searchFn({ data: { query: debouncedQuery } }),
		enabled: debouncedQuery.length > 0,
	})

	const clear = () => setQuery('')

	return {
		query,
		setQuery,
		results: data ?? [],
		isSearching: isFetching,
		clear,
	}
}

export const useRecentSearchResults = (limit: number): NoteEntity[] => {
	const notes = useNotes()
	return takeMostRecent(notes, limit)
}

const takeMostRecent = (notes: NoteEntity[], limit: number): NoteEntity[] => {
	return [...notes]
		.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
		.slice(0, limit)
}
