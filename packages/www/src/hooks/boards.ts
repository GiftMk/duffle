import { eq, useLiveQuery } from '@tanstack/react-db'
import { boardsCollection } from '@/lib/collections'

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
	const { data } = useLiveQuery((q) =>
		q
			.from({ board: boardsCollection })
			.orderBy(({ board }) => board.updatedAt, 'desc'),
	)
	return data
}
