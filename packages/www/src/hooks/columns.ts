import {
	queryOptions,
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from '@tanstack/react-query'
import { type Draft, produce } from 'immer'
import { removeItem, upsertItem } from '@/lib/query-list'
import { type ColumnEntity, columnSchema } from '@/lib/schemas'
import { utcNow } from '@/lib/utils'
import {
	deleteColumn as deleteColumnFn,
	getColumns,
	updateColumn as updateColumnFn,
} from '@/server/columns'

export const columnsQuery = queryOptions({
	queryKey: ['columns'],
	queryFn: async () => columnSchema.array().parse(await getColumns()),
	staleTime: Infinity,
})

export const useColumns = (boardId: string) => {
	const { data } = useSuspenseQuery(columnsQuery)
	return data
		.filter((column) => column.boardId === boardId)
		.sort((a, b) => a.position - b.position)
}

export const useUpdateColumn = () => {
	const queryClient = useQueryClient()

	const { mutate } = useMutation({
		mutationFn: (column: ColumnEntity) => updateColumnFn({ data: column }),
		onMutate: async (column) => {
			await queryClient.cancelQueries({ queryKey: columnsQuery.queryKey })
			const previous = queryClient.getQueryData<ColumnEntity[]>(
				columnsQuery.queryKey,
			)
			queryClient.setQueryData<ColumnEntity[]>(columnsQuery.queryKey, (old) =>
				upsertItem(old, column),
			)
			return { previous }
		},
		onError: (_err, _column, context) => {
			queryClient.setQueryData(columnsQuery.queryKey, context?.previous)
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: columnsQuery.queryKey })
		},
	})

	return (id: string, recipe: (draft: Draft<ColumnEntity>) => void) => {
		const columns =
			queryClient.getQueryData<ColumnEntity[]>(columnsQuery.queryKey) ?? []
		const column = columns.find((c) => c.id === id)
		if (!column) throw new Error(`Column with id '${id}' not found`)

		mutate(
			produce(column, (draft) => {
				recipe(draft)
				draft.updatedAt = utcNow()
			}),
		)
	}
}

export const useDeleteColumn = () => {
	const queryClient = useQueryClient()

	const { mutate } = useMutation({
		mutationFn: (id: string) => deleteColumnFn({ data: { id } }),
		onMutate: async (id) => {
			await queryClient.cancelQueries({ queryKey: columnsQuery.queryKey })
			const previous = queryClient.getQueryData<ColumnEntity[]>(
				columnsQuery.queryKey,
			)
			queryClient.setQueryData<ColumnEntity[]>(columnsQuery.queryKey, (old) =>
				removeItem(old, id),
			)
			return { previous }
		},
		onError: (_err, _id, context) => {
			queryClient.setQueryData(columnsQuery.queryKey, context?.previous)
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: columnsQuery.queryKey })
		},
	})

	return mutate
}
