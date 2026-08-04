import { useSelector } from '@xstate/store-react'
import { eq, useLiveQuery } from '@tanstack/react-db'
import { boardsCollection } from '@/state/collections'
import { preferencesStore } from '@/state/preferences-store'

export const useBoard = (id: string) => {
	const { data } = useLiveQuery(
		(q) => q.from({ board: boardsCollection }).where(({ board }) => eq(board.id, id)).findOne(),
		[id],
	)
	return data
}

export const useBoards = () => {
	const { data } = useLiveQuery((q) => q.from({ board: boardsCollection }))
	return data
}

export const useActiveBoardOrThrow = () => {
	const board = useActiveBoard()
	if (!board) {
		throw new Error('No active board')
	}

	return board
}

export const useActiveBoard = () => {
	const activeBoardId = useSelector(
		preferencesStore,
		(store) => store.context.activeBoardId,
	)

	return useBoard(activeBoardId ?? '')
}
