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
import { BoardContainer } from '@/components/boards/board-container'
import { IconButton } from '@/components/icon-button'
import { TitleInput } from '@/components/title-input'
import { deleteBoard, updateBoard } from '@/lib/actions'
import { ICON_SIZE_PX } from '@/lib/constants'
import type { BoardEntity } from '@/state/boards-store'

type BoardCardProps = {
	board: BoardEntity
}

export const BoardCard = ({ board }: BoardCardProps) => {
	const navigate = useNavigate()
	const [isEditing, setIsEditing] = useState(false)
	const [canNavigate, setCanNavigate] = useState(true)
	const [title, setTitle] = useState(board.title)

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

	const handlePointerEnter = () => setCanNavigate(false)

	const handlePointerLeave = () => setCanNavigate(true)

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

	return (
		<BoardContainer
			role='button'
			tabIndex={0}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			className='group relative bg-surface-50 px-4 text-sm text-typography-950'
		>
			<div
				onPointerEnter={handlePointerEnter}
				onPointerLeave={handlePointerLeave}
				className='absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100'
			>
				<IconButton onClick={startEditing}>
					<PencilSimpleIcon size={ICON_SIZE_PX} />
				</IconButton>
				<DeleteBoardDialog board={board} />
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

const DeleteBoardDialog = ({ board }: { board: BoardEntity }) => {
	return (
		<AlertDialogRoot>
			<AlertDialogTrigger
				render={
					<IconButton variant='destructive'>
						<TrashIcon size={ICON_SIZE_PX} />
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
