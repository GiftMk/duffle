import { Draggable } from '@hello-pangea/dnd'
import type { TaskEntity } from '@/lib/db'
import { cn, stripMarkdown } from '@/lib/utils'

type TaskProps = {
	task: TaskEntity
	index: number
	className?: string
}

const getTaskPreview = (task: TaskEntity) => {
	return task.description ? stripMarkdown(task.description).trim() : ''
}

export const Task = ({ task, index, className }: TaskProps) => {
	const preview = getTaskPreview(task)

	return (
		<Draggable draggableId={task.id} index={index}>
			{(provided) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					className={cn(
						'min-h-16 rounded-md border border-surface-400 bg-surface-50 px-3 py-3 text-sm text-typography-950 dark:bg-surface-300',
						className,
					)}
				>
					<p>{task.title}</p>
					{preview && (
						<p className='mt-1 line-clamp-2 text-typography-600 text-xs'>
							{preview}
						</p>
					)}
				</div>
			)}
		</Draggable>
	)
}
