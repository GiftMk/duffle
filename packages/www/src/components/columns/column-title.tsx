import { PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { deleteColumn, updateColumn } from '@/lib/actions'
import { ICON_SIZE_PX } from '@/lib/constants'
import { cn } from '@/lib/utils'
import {
	AlertDialogAction,
	AlertDialogActions,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogRoot,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '../alert-dialog'
import { IconButton } from '../icon-button'
import { TitleInput } from '../title-input'

type ColumnTitleProps = {
	id: string
	value: string
}

export const ColumnTitle = ({ id, value }: ColumnTitleProps) => {
	const [isEditing, setIsEditing] = useState(false)
	const [title, setTitle] = useState(value)

	const startEditing = () => {
		setIsEditing(true)
	}

	const handleSubmit = (title: string) => {
		setIsEditing(false)
		updateColumn(id, (draft) => {
			draft.title = title
		})
	}

	const handleCancel = () => {
		setIsEditing(false)
	}

	return (
		<div className='group flex items-center justify-between px-1'>
			{isEditing ? (
				<TitleInput
					className='font-bold'
					value={title}
					onChange={setTitle}
					onSubmit={handleSubmit}
					onCancel={handleCancel}
				/>
			) : (
				<h2 className='font-bold text-sm text-typography-950'>{title}</h2>
			)}
			<div
				className={cn(
					'flex gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100',
					{ invisible: isEditing },
				)}
			>
				<IconButton onClick={startEditing}>
					<PencilSimpleIcon size={ICON_SIZE_PX} />
				</IconButton>
				<DeleteColumnDialog id={id} title={title} />
			</div>
		</div>
	)
}

const DeleteColumnDialog = ({
	id,
	title,
	disabled,
}: {
	id: string
	title: string
	disabled?: boolean
}) => {
	return (
		<AlertDialogRoot>
			<AlertDialogTrigger
				disabled={disabled}
				render={
					<IconButton variant='destructive'>
						<TrashIcon size={ICON_SIZE_PX} />
					</IconButton>
				}
			/>
			<AlertDialogContent>
				<AlertDialogTitle>Delete column?</AlertDialogTitle>
				<AlertDialogDescription>
					This will permanently delete &quot;{title}&quot; and all of its tasks.
				</AlertDialogDescription>
				<AlertDialogActions>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						variant='destructive'
						onClick={() => deleteColumn(id)}
					>
						Delete
					</AlertDialogAction>
				</AlertDialogActions>
			</AlertDialogContent>
		</AlertDialogRoot>
	)
}
