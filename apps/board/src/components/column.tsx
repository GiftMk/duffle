import { cn } from '@duffle/utils'
import { Droppable } from '@hello-pangea/dnd'
import { useTasks } from '@/hooks/tasks'
import type { ColumnEntity } from '@/lib/schemas'
import { AddTaskCard } from './add-task-card'
import { ColumnTitle } from './column-title'
import { TaskCard } from './task-card'

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
						{tasks.map((task, index) => (
							<TaskCard
								key={task.id}
								task={task}
								index={index}
								className='mb-3'
							/>
						))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
			<AddTaskCard columnId={column.id} />
		</div>
	)
}
