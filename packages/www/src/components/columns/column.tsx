import { Droppable } from '@hello-pangea/dnd'
import { useColumnOrThrow } from '@/hooks/columns'
import { cn } from '@/lib/utils'
import { AddTaskCard } from '../tasks/add-task-card'
import { TaskCard } from '../tasks/task-card'
import { ColumnTitle } from './column-title'

type ColumnProps = {
	id: string
}

export const Column = ({ id }: ColumnProps) => {
	const column = useColumnOrThrow(id)

	return (
		<div className='flex w-80 shrink-0 flex-col'>
			<ColumnTitle id={column.id} value={column.title} />
			<Droppable droppableId={column.id}>
				{(provided, snapshot) => (
					<div
						ref={provided.innerRef}
						{...provided.droppableProps}
						className={cn(
							'mt-3 flex min-h-2 flex-col rounded-md p-1 transition-colors',
							{ 'bg-surface-200': snapshot.isDraggingOver },
						)}
					>
						{column.tasks.map((id, index) => (
							<TaskCard key={id} id={id} index={index} className='mb-3' />
						))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
			<AddTaskCard columnId={column.id} />
		</div>
	)
}
