import { TrashIcon } from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
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
import { BoardContainer } from '@/components/kanban/board-container'
import { useDeleteNote } from '@/hooks/notes'
import { ICON_SIZE_MD } from '@/lib/constants'
import type { NoteEntity } from '@/lib/schemas'
import { cn, onNextTick } from '@/lib/utils'

type NoteCardProps = {
	note: NoteEntity
}

export const NoteCard = ({ note }: NoteCardProps) => {
	const navigate = useNavigate()
	const [canNavigate, setCanNavigate] = useState(true)

	const handleClick = () => {
		if (!canNavigate) return
		navigate({ to: '/notes/$noteId', params: { noteId: note.id } })
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault()
			handleClick()
		}
	}

	const disableNavigation = () => setCanNavigate(false)
	const enableNavigation = () => setCanNavigate(true)

	const handleDialogClose = (open: boolean) => {
		if (!open) onNextTick(enableNavigation)
	}

	return (
		<BoardContainer
			role='button'
			tabIndex={0}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			className='group relative bg-surface-50 px-4 text-sm text-typography-950'
		>
			<div
				onPointerEnter={disableNavigation}
				onPointerLeave={enableNavigation}
				className='absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100'
			>
				<DeleteNoteDialog note={note} onOpenChange={handleDialogClose} />
			</div>
			<span
				className={cn('line-clamp-2 text-center', {
					'text-surface-400': !note.title,
				})}
			>
				{note.title || 'Untitled'}
			</span>
		</BoardContainer>
	)
}

const DeleteNoteDialog = ({
	note,
	onOpenChange,
}: {
	note: NoteEntity
	onOpenChange?: (open: boolean) => void
}) => {
	const deleteNote = useDeleteNote()

	return (
		<AlertDialogRoot onOpenChange={onOpenChange}>
			<AlertDialogTrigger
				render={
					<IconButton
						variant='destructive'
						onClick={(e) => e.stopPropagation()}
					>
						<TrashIcon size={ICON_SIZE_MD} />
					</IconButton>
				}
			/>
			<AlertDialogContent>
				<AlertDialogTitle>Delete note?</AlertDialogTitle>
				<AlertDialogDescription>
					This will permanently delete &quot;{note.title || 'Untitled'}&quot;.
				</AlertDialogDescription>
				<AlertDialogActions>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						variant='destructive'
						onClick={() => deleteNote(note.id)}
					>
						Delete
					</AlertDialogAction>
				</AlertDialogActions>
			</AlertDialogContent>
		</AlertDialogRoot>
	)
}
