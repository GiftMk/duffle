import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import { useActiveBoard } from '@/hooks/boards'
import { moveCard } from '@/lib/actions'
import { Column } from '../columns/column'

export const KanbanBoard = () => {
	const board = useActiveBoard()

	const handleDragEnd = (result: DropResult) => {
		if (!result.destination) return

		moveCard(
			{ columnId: result.source.droppableId, taskIndex: result.source.index },
			{
				columnId: result.destination.droppableId,
				taskIndex: result.destination.index,
			},
		)
	}

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<div className='flex h-full w-full items-start gap-6 overflow-x-auto p-8'>
				{board.columns.map((id) => (
					<Column key={id} id={id} />
				))}
			</div>
		</DragDropContext>
	)
}
