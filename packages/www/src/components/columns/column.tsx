import { Droppable } from '@hello-pangea/dnd'
import type { ColumnEntity } from '@/lib/db'
import { cn } from '@/lib/utils'
import { useBoardContext } from '../board/board-provider'
import { TaskCard } from '../tasks/task-card'
import { AddTaskCard } from '../tasks/add-task-card'
import { ColumnTitle } from './column-title'

type ColumnProps = {
	column: ColumnEntity
}

export const Column = ({ column }: ColumnProps) => {
	const { tasks } = useBoardContext()

	return (
		<div className='flex w-80 shrink-0 flex-col gap-3'>
			<ColumnTitle columnId={column.id} title={column.title} />
			<Droppable droppableId={column.id}>
				{(provided, snapshot) => (
					<div
						ref={provided.innerRef}
						{...provided.droppableProps}
						className={cn(
							'flex min-h-20 flex-col rounded-md p-1 transition-colors',
							snapshot.isDraggingOver && 'bg-surface-200',
						)}
					>
						{column.cardIds.map((cardId, index) => {
							const card = tasks[cardId]
							if (!card) return null
							return (
								<TaskCard
									key={card.id}
									task={card}
									index={index}
									className='mb-3'
								/>
							)
						})}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
			<AddTaskCard columnId={column.id} />
		</div>
	)
}
