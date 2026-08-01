import { useSelector } from '@xstate/store-react'
import { columnsStore } from '@/state/columns-store'

export const useColumn = (id: string) => {
	const column = useSelector(columnsStore, (store) => store.context.columns[id])

	if (!column) {
		throw new Error(`Column with id '${id}' not found`)
	}

	return column
}

export const useColumns = () => {
	const columns = useSelector(columnsStore, (store) => store.context.columns)
	return Object.values(columns)
}
