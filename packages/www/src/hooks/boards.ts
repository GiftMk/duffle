import { useSelector } from '@xstate/store-react'
import { boardsStore } from '@/state/boards-store'

export const useBoard = (id: string) => {
	const board = useSelector(boardsStore, (store) => store.context.boards[id])

	if (!board) {
		throw new Error(`Board with id '${id}' not found`)
	}

	return board
}

export const useBoards = () => {
	const boards = useSelector(boardsStore, (store) => store.context.boards)
	return Object.values(boards)
}

export const useActiveBoard = () => {
	const board = useSelector(boardsStore, (store) =>
		store.context.active
			? store.context.boards[store.context.active]
			: undefined,
	)

	if (!board) {
		throw new Error('No active board')
	}

	return board
}
