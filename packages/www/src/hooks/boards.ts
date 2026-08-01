import { useSelector } from '@xstate/store-react'
import { boardsStore } from '@/state/boards-store'

export const useBoard = (id: string) => {
	return useSelector(boardsStore, (store) => store.context.boards[id])
}

export const useBoards = () => {
	const boards = useSelector(boardsStore, (store) => store.context.boards)
	return Object.values(boards)
}

export const useActiveBoardOrThrow = () => {
	const board = useActiveBoard()
	if (!board) {
		throw new Error('No active board')
	}

	return board
}

export const useActiveBoard = () => {
	return useSelector(boardsStore, (store) =>
		store.context.active
			? store.context.boards[store.context.active]
			: undefined,
	)
}
