import { queryOptions } from '@tanstack/react-query'
import { getNoteFn } from '@/server/notes.functions'

export const noteQueryOptions = (id: string) =>
	queryOptions({
		queryKey: ['note', id],
		queryFn: async () => (await getNoteFn({ data: { id } })) ?? null,
	})
