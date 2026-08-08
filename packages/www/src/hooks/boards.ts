import {
	queryOptions,
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from '@tanstack/react-query'
import { type Draft, produce } from 'immer'
import { uuidv7 } from 'uuidv7'
import { columnsQuery } from '@/hooks/columns'
import { removeItem, upsertItem, upsertItems } from '@/lib/query-list'
import { type BoardEntity, boardSchema, type ColumnEntity } from '@/lib/schemas'
import { utcNow } from '@/lib/utils'
import {
	createBoardFn,
	deleteBoardFn,
	getBoardsFn,
	updateBoardFn,
} from '@/server/boards'
import { createColumnFn } from '@/server/columns'

export const boardsQuery = queryOptions({
	queryKey: ['boards'],
	queryFn: async () => boardSchema.array().parse(await getBoardsFn()),
	staleTime: Infinity,
})

export const useBoards = () => {
	const { data } = useSuspenseQuery(boardsQuery)
	return [...data].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export const useBoard = (id: string) => {
	const boards = useBoards()
	return boards.find((board) => board.id === id)
}

export const useCreateBoard = () => {
	const queryClient = useQueryClient()

	const { mutate } = useMutation({
		mutationFn: async ({
			board,
			columns,
		}: {
			board: BoardEntity
			columns: ColumnEntity[]
		}) => {
			await createBoardFn({ data: board })
			await Promise.all(
				columns.map((column) => createColumnFn({ data: column })),
			)
		},
		onMutate: ({ board, columns }) => {
			queryClient.setQueryData<BoardEntity[]>(boardsQuery.queryKey, (old) =>
				upsertItem(old, board),
			)
			queryClient.setQueryData<ColumnEntity[]>(columnsQuery.queryKey, (old) =>
				upsertItems(old, columns),
			)
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: boardsQuery.queryKey })
			queryClient.invalidateQueries({ queryKey: columnsQuery.queryKey })
		},
	})

	return (title: string) => {
		const timestamp = utcNow()

		const board: BoardEntity = {
			id: uuidv7(),
			title,
			createdAt: timestamp,
			updatedAt: timestamp,
		}

		const columns: ColumnEntity[] = ['Todo', 'In Progress', 'Done'].map(
			(title, i) => ({
				id: uuidv7(),
				boardId: board.id,
				position: i,
				title,
				createdAt: timestamp,
				updatedAt: timestamp,
			}),
		)

		mutate({ board, columns })

		return board
	}
}

export const useUpdateBoard = () => {
	const queryClient = useQueryClient()

	const { mutate } = useMutation({
		mutationFn: (board: BoardEntity) => updateBoardFn({ data: board }),
		onMutate: async (board) => {
			await queryClient.cancelQueries({ queryKey: boardsQuery.queryKey })
			const previous = queryClient.getQueryData<BoardEntity[]>(
				boardsQuery.queryKey,
			)
			queryClient.setQueryData<BoardEntity[]>(boardsQuery.queryKey, (old) =>
				upsertItem(old, board),
			)
			return { previous }
		},
		onError: (_err, _board, context) => {
			queryClient.setQueryData(boardsQuery.queryKey, context?.previous)
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: boardsQuery.queryKey })
		},
	})

	return (
		id: string,
		recipe: (draft: Draft<Omit<BoardEntity, 'columns'>>) => void,
	) => {
		const boards =
			queryClient.getQueryData<BoardEntity[]>(boardsQuery.queryKey) ?? []
		const board = boards.find((b) => b.id === id)
		if (!board) throw new Error(`Board with id '${id}' not found`)

		mutate(
			produce(board, (draft) => {
				recipe(draft)
				draft.updatedAt = utcNow()
			}),
		)
	}
}

export const useDeleteBoard = () => {
	const queryClient = useQueryClient()

	const { mutate } = useMutation({
		mutationFn: (id: string) => deleteBoardFn({ data: { id } }),
		onMutate: async (id) => {
			await queryClient.cancelQueries({ queryKey: boardsQuery.queryKey })
			const previous = queryClient.getQueryData<BoardEntity[]>(
				boardsQuery.queryKey,
			)
			queryClient.setQueryData<BoardEntity[]>(boardsQuery.queryKey, (old) =>
				removeItem(old, id),
			)
			return { previous }
		},
		onError: (_err, _id, context) => {
			queryClient.setQueryData(boardsQuery.queryKey, context?.previous)
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: boardsQuery.queryKey })
		},
	})

	return mutate
}
