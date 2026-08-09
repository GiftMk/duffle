import { createOptimisticAction, useLiveQuery } from '@tanstack/react-db'
import { uuidv7 } from 'uuidv7'
import { boardsCollection, columnsCollection } from '@/lib/collections'
import type { BoardEntity, ColumnEntity } from '@/lib/schemas'
import { boardToSearchItem, searchWorker } from '@/lib/search'
import { utcNow } from '@/lib/utils'
import { createBoardFn } from '@/server/boards'
import { createColumnFn } from '@/server/columns'

export const useBoards = () => {
	const { data } = useLiveQuery((q) =>
		q
			.from({ board: boardsCollection })
			.orderBy(({ board }) => board.updatedAt, 'desc'),
	)
	return data
}

export const useBoard = (id: string) => {
	const boards = useBoards()
	return boards.find((board) => board.id === id)
}

type CreateBoardVars = { board: BoardEntity; columns: ColumnEntity[] }

const createBoardAction = createOptimisticAction<CreateBoardVars>({
	onMutate: ({ board, columns }) => {
		boardsCollection.insert(board)
		columnsCollection.insert(columns)
	},
	mutationFn: async ({ board, columns }) => {
		await createBoardFn({ data: board })
		await Promise.all(columns.map((column) => createColumnFn({ data: column })))

		await Promise.all([
			boardsCollection.utils.refetch(),
			columnsCollection.utils.refetch(),
		])
	},
})

export const useCreateBoard = () => {
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

		createBoardAction({ board, columns })
		searchWorker.add([boardToSearchItem(board)])

		return board
	}
}

export const useUpdateBoard = () => {
	return (
		id: string,
		recipe: (draft: Omit<BoardEntity, 'columns'>) => void,
	) => {
		const board = boardsCollection.get(id)
		if (!board) throw new Error(`Board with id '${id}' not found`)

		boardsCollection.update(id, (draft) => {
			recipe(draft)
			draft.updatedAt = utcNow()
		})

		const updated = boardsCollection.get(id)
		if (updated) searchWorker.update([boardToSearchItem(updated)])
	}
}

export const useDeleteBoard = () => {
	return (id: string) => {
		const board = boardsCollection.get(id)
		if (!board) throw new Error(`Board with id '${id}' not found`)

		boardsCollection.delete(id)
	}
}
