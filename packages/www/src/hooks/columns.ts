import { eq, useLiveQuery } from '@tanstack/react-db'
import { columnsCollection } from '@/state/collections'

export const useColumns = (boardId: string) => {
	const { data } = useLiveQuery((q) =>
		q
			.from({ column: columnsCollection })
			.where(({ column }) => eq(column.boardId, boardId))
			.orderBy(({ column }) => column.position, 'asc'),
	)
	return data
}
