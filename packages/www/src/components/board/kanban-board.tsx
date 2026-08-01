import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import { BoardColumn } from './board-column'
import { useBoardContext } from './board-provider'

export const KanbanBoard = () => {
	const { columns, ready, moveCard } = useBoardContext()

	const handleDragEnd = (result: DropResult) => {
		if (!result.destination) return

		moveCard(
			{ columnId: result.source.droppableId, index: result.source.index },
			{
				columnId: result.destination.droppableId,
				index: result.destination.index,
			},
		)
	}

	if (!ready) {
		return (
			<div className='flex h-full w-full items-center justify-center text-typography-600'>
				Loading board…
			</div>
		)
	}

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<div className='flex h-full w-full items-start gap-6 overflow-x-auto p-8'>
				{columns.map((column) => (
					<BoardColumn key={column.id} column={column} />
				))}
			</div>
		</DragDropContext>
	)
}
