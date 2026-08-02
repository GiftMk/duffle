import { Draggable } from '@hello-pangea/dnd'
import { useTaskOrThrow } from '@/hooks/tasks'
import { cn, stripMarkdown } from '@/lib/utils'
import { TaskDialog } from './task-dialog'
import { updateTask } from '@/lib/actions'

type TaskCardProps = {
	id: string
	index: number
	className?: string
}

export const TaskCard = ({ id, index, className }: TaskCardProps) => {
	const task = useTaskOrThrow(id)
	const preview = task.description ? stripMarkdown(task.description).trim() : ''

	const handleSubmit = (title: string, description?: string) => {
		updateTask(task.id, (draft) => {
			draft.title = title
			draft.description = description
		})
	}

	return (
		<TaskDialog
			trigger={
				<div>
					<Draggable draggableId={task.id} index={index}>
						{(provided) => (
							<div
								ref={provided.innerRef}
								{...provided.draggableProps}
								{...provided.dragHandleProps}
								className={cn(
									'min-h-16 cursor-auto! space-y-1.5 rounded-md border border-surface-400 bg-surface-50 px-3 py-3 text-sm text-typography-950 focus:ring-0 dark:bg-surface-300',
									className,
								)}
							>
								<p className='line-clamp-1'>{task.title}</p>
								{preview && (
									<p className='mt-1 line-clamp-1 text-typography-600 text-xs'>
										{preview}
									</p>
								)}
							</div>
						)}
					</Draggable>
				</div>
			}
			title={task.title}
			description={task.description}
			onSubmit={handleSubmit}
			submitLabel='Save'
		/>
	)
}
