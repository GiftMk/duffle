import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { NoteEntity } from '@/lib/schemas'
import { searchFn } from '@/server/notes.functions'
import { useDebounce } from './use-debounce'

export type SearchState = 'recent' | 'loading' | 'results' | 'empty'

type GetSearchStateParams = {
	hasQuery: boolean
	isSearching: boolean
	resultCount: number
}

export const getSearchState = ({
	hasQuery,
	isSearching,
	resultCount,
}: GetSearchStateParams): SearchState => {
	if (!hasQuery) return 'recent'
	if (resultCount > 0) return 'results'
	if (isSearching) return 'loading'
	return 'empty'
}

type UseSearchResult = {
	query: string
	setQuery: (query: string) => void
	results: NoteEntity[]
	state: SearchState
	isRefreshing: boolean
	clear: () => void
}

const SEARCH_RESULTS_LIMIT = 24

export const useSearch = (): UseSearchResult => {
	const [query, setQuery] = useState('')
	const debouncedQuery = useDebounce(query, 250)
	const hasQuery = query.length > 0

	const { data, isFetching } = useQuery({
		queryKey: ['search', debouncedQuery],
		queryFn: () =>
			searchFn({
				data: { query: debouncedQuery, limit: SEARCH_RESULTS_LIMIT },
			}),
		enabled: debouncedQuery.length > 0,
		placeholderData: keepPreviousData,
	})

	const results = hasQuery ? (data ?? []) : []
	const isSearching = hasQuery && (query !== debouncedQuery || isFetching)

	const state = getSearchState({
		hasQuery,
		isSearching,
		resultCount: results.length,
	})

	const clear = () => setQuery('')

	return {
		query,
		setQuery,
		results,
		state,
		isRefreshing: state === 'results' && isSearching,
		clear,
	}
}
