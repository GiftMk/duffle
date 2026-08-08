import { PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react'
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
import { TitleInput } from '@/components/title-input'
import { useDeleteBoard, useUpdateBoard } from '@/hooks/boards'
import { ICON_SIZE_MD } from '@/lib/constants'
import type { BoardEntity } from '@/lib/schemas'
import { onNextTick } from '@/lib/utils'

type BoardCardProps = {
	board: BoardEntity
}

export const BoardCard = ({ board }: BoardCardProps) => {
	const navigate = useNavigate()
	const [isEditing, setIsEditing] = useState(false)
	const [canNavigate, setCanNavigate] = useState(true)
	const [title, setTitle] = useState(board.title)
	const updateBoard = useUpdateBoard()

	const handleClick = () => {
		if (!canNavigate) return
		if (isEditing) return

		navigate({ to: '/boards/$boardId', params: { boardId: board.id } })
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (isEditing) return
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault()
			handleClick()
		}
	}

	const disableNavigation = () => setCanNavigate(false)
	const enableNavigation = () => setCanNavigate(true)

	const startEditing = (e: React.MouseEvent) => {
		e.stopPropagation()
		setIsEditing(true)
	}

	const handleSubmit = (title: string) => {
		setIsEditing(false)
		updateBoard(board.id, (draft) => {
			draft.title = title
		})
	}

	const handleCancel = () => {
		setIsEditing(false)
	}

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
				<IconButton onClick={startEditing}>
					<PencilSimpleIcon size={ICON_SIZE_MD} />
				</IconButton>
				<DeleteBoardDialog board={board} onOpenChange={handleDialogClose} />
			</div>
			{isEditing ? (
				<TitleInput
					value={title}
					onChange={setTitle}
					onSubmit={handleSubmit}
					onCancel={handleCancel}
					className='text-center'
				/>
			) : (
				<span className='line-clamp-2 text-center'>{board.title}</span>
			)}
		</BoardContainer>
	)
}

const DeleteBoardDialog = ({
	board,
	onOpenChange,
}: {
	board: BoardEntity
	onOpenChange?: (open: boolean) => void
}) => {
	const deleteBoard = useDeleteBoard()

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
				<AlertDialogTitle>Delete board?</AlertDialogTitle>
				<AlertDialogDescription>
					This will permanently delete &quot;{board.title}&quot; and all of its
					columns and tasks.
				</AlertDialogDescription>
				<AlertDialogActions>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						variant='destructive'
						onClick={() => deleteBoard(board.id)}
					>
						Delete
					</AlertDialogAction>
				</AlertDialogActions>
			</AlertDialogContent>
		</AlertDialogRoot>
	)
}
