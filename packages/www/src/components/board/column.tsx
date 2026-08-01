import { Droppable } from '@hello-pangea/dnd'
import type { ColumnEntity } from '@/lib/db'
import { cn } from '@/lib/utils'
import { AddTask } from './add-task'
import { Task } from './board-card'
import { useBoardContext } from './board-provider'
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
								<Task
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
			<AddTask columnId={column.id} />
		</div>
	)
}
