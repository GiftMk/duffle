import { Draggable } from '@hello-pangea/dnd'
import { TrashIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import {
	AlertDialogAction,
	AlertDialogActions,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogRoot,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/alert-dialog'
import { IconButton } from '@/components/icon-button'
import { useTaskOrThrow } from '@/hooks/tasks'
import { deleteTask, updateTask } from '@/lib/actions'
import { ICON_SIZE_SM } from '@/lib/constants'
import { cn, stripMarkdown } from '@/lib/utils'
import type { TaskEntity } from '@/state/tasks-store'
import { TaskDialog } from './task-dialog'

type TaskCardProps = {
	id: string
	index: number
	className?: string
}

export const TaskCard = ({ id, index, className }: TaskCardProps) => {
	const task = useTaskOrThrow(id)
	const preview = task.description ? stripMarkdown(task.description).trim() : ''
	const [disabled, setDisabled] = useState(false)

	const handleSubmit = (title: string, description?: string) => {
		updateTask(task.id, (draft) => {
			draft.title = title
			draft.description = description
		})
	}

	const handlePointerEnter = () => setDisabled(true)

	const handlePointerLeave = () => setDisabled(false)

	return (
		<TaskDialog
			trigger={
				<div className='select-none focus:outline-none'>
					<Draggable draggableId={task.id} index={index}>
						{(provided) => (
							<div
								ref={provided.innerRef}
								{...provided.draggableProps}
								{...provided.dragHandleProps}
								className={cn(
									'group relative min-h-16 cursor-auto! space-y-1.5 rounded-md border border-surface-400 bg-surface-50 px-3 py-3 text-sm text-typography-950 dark:bg-surface-300',
									className,
								)}
							>
								<div
									onPointerEnter={handlePointerEnter}
									onPointerLeave={handlePointerLeave}
									className='absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100'
								>
									<DeleteTaskDialog task={task} />
								</div>
								<p className='line-clamp-1 pr-6'>{task.title}</p>
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
			disabled={disabled}
		/>
	)
}

const DeleteTaskDialog = ({ task }: { task: TaskEntity }) => {
	return (
		<AlertDialogRoot>
			<AlertDialogTrigger
				render={
					<IconButton variant='destructive'>
						<TrashIcon size={ICON_SIZE_SM} />
					</IconButton>
				}
			/>
			<AlertDialogContent>
				<AlertDialogTitle>Delete task?</AlertDialogTitle>
				<AlertDialogDescription>
					This will permanently delete &quot;{task.title}&quot;.
				</AlertDialogDescription>
				<AlertDialogActions>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						variant='destructive'
						onClick={() => deleteTask(task.id)}
					>
						Delete
					</AlertDialogAction>
				</AlertDialogActions>
			</AlertDialogContent>
		</AlertDialogRoot>
	)
}
