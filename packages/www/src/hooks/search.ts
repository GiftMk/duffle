import { queryOptions, useQuery } from '@tanstack/react-query'
import { type SearchResult, searchResultSchema } from '@/lib/schemas'
import { searchFn } from '@/server/search'

export const searchQuery = (query: string) =>
	queryOptions({
		queryKey: ['search', query],
		queryFn: async () =>
			searchResultSchema.array().parse(await searchFn({ data: { query } })),
		enabled: query.trim().length > 0,
	})

export const useSearch = (query: string) => useQuery(searchQuery(query))

export type { SearchResult }
