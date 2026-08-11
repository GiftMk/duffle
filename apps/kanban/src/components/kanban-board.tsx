import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import { useColumns } from '@/hooks/columns'
import { useMoveTask } from '@/hooks/tasks'
import type { BoardEntity } from '@/lib/schemas'
import { Column } from './column'

type KanbanBoardProps = {
	board: BoardEntity
}

export const KanbanBoard = ({ board }: KanbanBoardProps) => {
	const columns = useColumns(board.id)
	const moveTask = useMoveTask()

	const handleDragEnd = (result: DropResult) => {
		if (!result.destination) return

		moveTask(
			{ columnId: result.source.droppableId, index: result.source.index },
			{
				columnId: result.destination.droppableId,
				index: result.destination.index,
			},
		)
	}

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<div className='flex h-full w-full items-start gap-6 overflow-x-auto'>
				{columns.map((column) => (
					<Column key={column.id} column={column} />
				))}
			</div>
		</DragDropContext>
	)
}
