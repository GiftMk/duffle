import { columnCollection } from '@/state/collections'

type DragEndTarget = {
	columnId: string
	index: number
}

type DragEndProps = {
	source: DragEndTarget
	destination: DragEndTarget
}

export const moveTasks = ({ source, destination }: DragEndProps) => {
	let sourceTaskId: string | undefined

	columnCollection.update(source.columnId, (draft) => {
		const [taskId] = draft.tasks.splice(source.index, 1)
		sourceTaskId = taskId
	})

	const targetColumnId =
		source.columnId === destination.columnId
			? source.columnId
			: destination.columnId

	columnCollection.update(targetColumnId, (draft) => {
		if (!sourceTaskId) {
			throw new Error(
				`Failed to move tasks. Task not found at source index ${source.index}`,
			)
		}

		draft.tasks.splice(destination.index, 0, sourceTaskId)
	})
}
