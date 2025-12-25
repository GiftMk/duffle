import { Droppable } from '@hello-pangea/dnd'
import type { FC } from 'react'
import { cn } from '@/lib/utils'
import { TaskCard } from './task-card'

type TaskListProps = {
	columnId: string
	taskIds: string[]
}

export const TaskList: FC<TaskListProps> = ({ columnId, taskIds }) => {
	return (
		<Droppable droppableId={columnId}>
			{(provided, snapshot) => (
				<div
					ref={provided.innerRef}
					{...provided.droppableProps}
					className={cn(
						'flex h-full w-full flex-col transition-all duration-100',
						{
							'outline-dashed outline-2 outline-foreground-muted outline-offset-8':
								snapshot.isDraggingOver,
						},
					)}
				>
					{taskIds.map((id, i) => (
						<TaskCard key={id} id={id} index={i} className='mb-4' />
					))}
					<div>{provided.placeholder}</div>
				</div>
			)}
		</Droppable>
	)
}
