import { ContextMenu } from '@base-ui/react/context-menu'
import type { TaskEntity } from '@/lib/schemas'
import { Draggable } from '@hello-pangea/dnd'
import { PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import {
	AlertDialogAction,
	AlertDialogActions,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogRoot,
	AlertDialogTitle,
} from '@/components/alert-dialog'
import { deleteTask, updateTask } from '@/lib/actions'
import { stripMarkdown } from '@/lib/utils'
import { ICON_SIZE_SM } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { TaskDialog } from './task-dialog'

type TaskCardProps = {
	task: TaskEntity
	className?: string
}

export const TaskCard = ({ task, className }: TaskCardProps) => {
	const preview = task.description ? stripMarkdown(task.description).trim() : ''
	const [dialogOpen, setDialogOpen] = useState(false)

	const handleSubmit = (title: string, description?: string) => {
		updateTask(task.id, (draft) => {
			draft.title = title
			draft.description = description
		})
	}

	return (
		<TaskCardContextMenu task={task} onEdit={() => setDialogOpen(true)}>
			<TaskDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				trigger={
					<ContextMenu.Trigger
						render={
							<button
								type='button'
								className='select-none text-start focus:outline-none'
							>
								<Draggable draggableId={task.id} index={task.position}>
									{(provided) => (
										<div
											ref={provided.innerRef}
											{...provided.draggableProps}
											{...provided.dragHandleProps}
											className={cn(
												'min-h-16 cursor-auto! space-y-1.5 rounded-md border border-surface-400 bg-surface-50 px-3 py-3 text-sm text-typography-950 dark:bg-surface-300',
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
							</button>
						}
					/>
				}
				title={task.title}
				description={task.description}
				onSubmit={handleSubmit}
				submitLabel='Save'
			/>
		</TaskCardContextMenu>
	)
}

const TaskCardContextMenu = ({
	task,
	onEdit,
	children,
}: {
	task: TaskEntity
	onEdit: () => void
	children: ReactNode
}) => {
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

	return (
		<ContextMenu.Root>
			{children}
			<ContextMenu.Portal>
				<ContextMenu.Positioner className='outline-none'>
					<ContextMenu.Popup className='min-w-40 rounded-md border border-surface-400 bg-surface-100 py-1 shadow-md shadow-surface-400/40 focus:outline-none'>
						<ContextMenu.Item
							onClick={onEdit}
							className='flex cursor-default items-center gap-2 px-3 py-1.5 text-sm text-typography-950 outline-none data-[highlighted]:bg-surface-200'
						>
							<PencilSimpleIcon size={ICON_SIZE_SM} />
							Edit
						</ContextMenu.Item>
						<ContextMenu.Item
							onClick={() => setDeleteDialogOpen(true)}
							className='flex cursor-default items-center gap-2 px-3 py-1.5 text-red-600 text-sm outline-none data-[highlighted]:bg-surface-200'
						>
							<TrashIcon size={ICON_SIZE_SM} />
							Delete
						</ContextMenu.Item>
					</ContextMenu.Popup>
				</ContextMenu.Positioner>
			</ContextMenu.Portal>
			<AlertDialogRoot
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
			>
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
		</ContextMenu.Root>
	)
}
