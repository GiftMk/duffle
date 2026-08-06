import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import { useColumns } from '@/hooks/columns'
import { moveTask } from '@/lib/actions'
import type { BoardEntity } from '@/lib/schemas'
import { Column } from './column'

const handleDragEnd = (result: DropResult) => {
	if (!result.destination) return

	moveTask(
		{ columnId: result.source.droppableId, position: result.source.index },
		{
			columnId: result.destination.droppableId,
			position: result.destination.index,
		},
	)
}

type KanbanBoardProps = {
	board: BoardEntity
}

export const KanbanBoard = ({ board }: KanbanBoardProps) => {
	const columns = useColumns(board.id)

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<div className='flex items-start gap-6 overflow-x-auto'>
				{columns.map((column) => (
					<Column key={column.id} column={column} />
				))}
			</div>
		</DragDropContext>
	)
}
