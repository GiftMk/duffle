import { eq, useLiveQuery } from '@tanstack/react-db'
import { useSelector } from '@xstate/store-react'
import { boardsCollection } from '@/lib/collections'
import { preferencesStore } from '@/lib/stores'

export const useBoard = (id: string) => {
	const { data } = useLiveQuery(
		(q) =>
			q
				.from({ board: boardsCollection })
				.where(({ board }) => eq(board.id, id))
				.findOne(),
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
