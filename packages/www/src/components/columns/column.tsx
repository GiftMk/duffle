import type { ColumnEntity } from '@duffle/api'
import { Droppable } from '@hello-pangea/dnd'
import { useTasks } from '@/hooks/tasks'
import { cn } from '@/lib/utils'
import { AddTaskCard } from '../tasks/add-task-card'
import { TaskCard } from '../tasks/task-card'
import { ColumnTitle } from './column-title'

type ColumnProps = {
	column: ColumnEntity
}

export const Column = ({ column }: ColumnProps) => {
	const tasks = useTasks(column.id)

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
						{tasks.map((task) => (
							<TaskCard key={task.id} task={task} className='mb-3' />
						))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
			<AddTaskCard columnId={column.id} />
		</div>
	)
}
