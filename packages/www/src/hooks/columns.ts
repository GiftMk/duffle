import { eq, useLiveQuery } from '@tanstack/react-db'
import type { Draft } from 'immer'
import { columnsCollection } from '@/lib/collections'
import type { ColumnEntity } from '@/lib/schemas'
import { utcNow } from '@/lib/utils'

export const useColumns = (boardId: string) => {
	const { data } = useLiveQuery((q) =>
		q
			.from({ column: columnsCollection })
			.where(({ column }) => eq(column.boardId, boardId))
			.orderBy(({ column }) => column.position, 'asc'),
	)
	return data
}

export const useUpdateColumn = () => {
	return (id: string, recipe: (draft: Draft<ColumnEntity>) => void) => {
		const column = columnsCollection.get(id)
		if (!column) throw new Error(`Column with id '${id}' not found`)

		columnsCollection.update(id, (draft) => {
			recipe(draft)
			draft.updatedAt = utcNow()
		})
	}
}

export const useDeleteColumn = () => {
	return (id: string) => {
		const column = columnsCollection.get(id)
		if (!column) throw new Error(`Column with id '${id}' not found`)

		columnsCollection.delete(id)
	}
}
