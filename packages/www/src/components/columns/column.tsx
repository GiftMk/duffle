import { Droppable } from '@hello-pangea/dnd'
import { useColumn } from '@/hooks/columns'
import { cn } from '@/lib/utils'
import { AddTaskCard } from '../tasks/add-task-card'
import { TaskCard } from '../tasks/task-card'
import { ColumnTitle } from './column-title'

type ColumnProps = {
	id: string
}

export const Column = ({ id }: ColumnProps) => {
	const column = useColumn(id)

	return (
		<div className='flex w-80 shrink-0 flex-col gap-3'>
			<ColumnTitle id={column.id} title={column.title} />
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
