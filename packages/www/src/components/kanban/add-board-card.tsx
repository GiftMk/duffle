import { PlusIcon } from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { uuidv7 } from 'uuidv7'
import { BoardContainer } from '@/components/kanban/board-container'
import { TitleInput } from '@/components/title-input'
import { useCreateBoard } from '@/hooks/boards'
import { ICON_SIZE_MD } from '@/lib/constants'
import { onNextTick } from '@/lib/utils'

export const AddBoardCard = () => {
	const navigate = useNavigate()
	const createBoard = useCreateBoard()
	const [isEditing, setIsEditing] = useState(false)
	const [title, setTitle] = useState('')

	const handleSubmit = (title: string) => {
		setIsEditing(false)
		const id = uuidv7()
		navigate({ to: '/boards/$boardId', params: { boardId: id } })
		onNextTick(() => createBoard(id, title))
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
			<PlusIcon size={ICON_SIZE_MD} />
		</button>
	)
}
