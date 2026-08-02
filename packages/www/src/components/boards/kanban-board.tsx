import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import { moveCard } from '@/lib/actions'
import type { BoardEntity } from '@/state/boards-store'
import { Column } from '../columns/column'

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

type KanbanBoardProps = {
	board: BoardEntity
}

export const KanbanBoard = ({ board }: KanbanBoardProps) => {
	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<div className='mt-8 flex items-start gap-6 overflow-x-auto'>
				{board.columns.map((id) => (
					<Column key={id} id={id} />
				))}
			</div>
		</DragDropContext>
	)
}
