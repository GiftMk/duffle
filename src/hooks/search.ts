import type { Autocomplete } from '@base-ui/react'
import { useHotkey } from '@tanstack/react-hotkeys'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import type { RefObject } from 'react'
import { useState } from 'react'
import { useNotes } from '@/hooks/notes'
import { useDimensions } from '@/hooks/use-dimensions'
import { RECENT_RESULTS_LIMIT, SEARCH_RESULTS_LIMIT } from '@/lib/constants'
import type { NoteEntity } from '@/lib/schemas'
import { clamp } from '@/lib/utils'
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

export const useRecentSearchResults = (
	limit: number = RECENT_RESULTS_LIMIT,
): NoteEntity[] => {
	const notes = useNotes()
	return takeMostRecent(notes, limit)
}

const takeMostRecent = (notes: NoteEntity[], limit: number): NoteEntity[] => {
	return [...notes]
		.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
		.slice(0, limit)
}

type UseSearchDialogResult = {
	open: boolean
	setOpen: (open: boolean) => void
	close: () => void
	query: string
	handleValueChange: (
		value: string,
		details: Autocomplete.Root.ChangeEventDetails,
	) => void
	items: NoteEntity[]
	state: SearchState
	isRefreshing: boolean
	selectNote: (note: NoteEntity) => void
}

export const useSearchDialog = (): UseSearchDialogResult => {
	const [open, setOpenState] = useState(false)
	const navigate = useNavigate()

	const { query, setQuery, results, state, isRefreshing, clear } = useSearch()
	const recentResults = useRecentSearchResults()

	const items = query.length > 0 ? results : recentResults

	const setOpen = (nextOpen: boolean) => {
		setOpenState(nextOpen)
		if (!nextOpen) clear()
	}

	const close = () => setOpen(false)

	const handleValueChange = (
		value: string,
		details: Autocomplete.Root.ChangeEventDetails,
	) => {
		if (details.reason === 'item-press') return
		setQuery(value)
	}

	const selectNote = (note: NoteEntity) => {
		close()
		navigate({ to: '/notes/$noteId', params: { noteId: note.id } })
	}

	useHotkey('Mod+K', () => {
		setOpen(true)
	})

	return {
		open,
		setOpen,
		close,
		query,
		handleValueChange,
		items,
		state,
		isRefreshing,
		selectNote,
	}
}

type GridColumnsOptions = {
	minCardWidth: number
	gap: number
	maxColumns: number
}

export const computeGridColumns = (
	width: number,
	{ minCardWidth, gap, maxColumns }: GridColumnsOptions,
): number => {
	if (width <= 0) return 1
	const columns = Math.floor((width + gap) / (minCardWidth + gap))
	return clamp(columns, 1, maxColumns)
}

export const useGridColumns = (
	ref: RefObject<Element | null>,
	options: GridColumnsOptions,
): number => {
	const { width } = useDimensions(ref)
	return computeGridColumns(width, options)
}
