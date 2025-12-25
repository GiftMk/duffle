import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import { eq, useLiveQuery } from '@tanstack/react-db'
import type { FC } from 'react'
import { moveTasks } from '@/lib/dnd'
import { boardCollection } from '@/state/collections'
import { ColumnCard } from './column-card'

type KanbanProps = {
	id: string
}

const handleDragEnd = (result: DropResult) => {
	if (!result.destination) {
		return
	}

	moveTasks({
		source: {
			columnId: result.source.droppableId,
			index: result.source.index,
		},
		destination: {
			columnId: result.destination.droppableId,
			index: result.destination.index,
		},
	})
}

export const KanbanBoard: FC<KanbanProps> = ({ id }) => {
	const { data: board } = useLiveQuery((q) =>
		q
			.from({ board: boardCollection })
			.where(({ board }) => eq(board.id, id))
			.findOne(),
	)

	if (!board) {
		// TODO: handle this better, return some form of skeleton component that shows board not found
		return null
	}

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<div className='mx-auto flex h-full w-fit items-start gap-2 overflow-x-auto p-8'>
				{board.columns.map((id) => (
					<ColumnCard key={id} id={id} />
				))}
			</div>
		</DragDropContext>
	)
}
