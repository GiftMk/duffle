import { PlusIcon } from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { BoardContainer } from '@/components/boards/board-container'
import { TitleInput } from '@/components/title-input'
import { createBoard } from '@/lib/actions'
import { ICON_SIZE_PX } from '@/lib/constants'

export const AddBoardCard = () => {
	const navigate = useNavigate()
	const [isEditing, setIsEditing] = useState(false)
	const [title, setTitle] = useState('')

	const handleSubmit = (title: string) => {
		setIsEditing(false)
		const board = createBoard(title)
		navigate({ to: '/boards/$boardId', params: { boardId: board.id } })
	}

	const handleCancel = () => {
		setIsEditing(false)
	}

	if (isEditing) {
		return (
			<BoardContainer>
				<TitleInput
					value={title}
					onChange={setTitle}
					placeholder='Board name'
					onSubmit={handleSubmit}
					onCancel={handleCancel}
					className='w-fit'
				/>
			</BoardContainer>
		)
	}

	return (
		<button
			type='button'
			onClick={() => setIsEditing(true)}
			className='flex h-44 w-72 shrink-0 items-center justify-center rounded-md border border-surface-400 bg-surface-50 text-typography-500 transition-colors hover:bg-surface-200 hover:text-typography-600 dark:bg-surface-300'
		>
			<PlusIcon size={ICON_SIZE_PX} />
		</button>
	)
}
