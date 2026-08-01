import { PlusIcon } from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { createBoard } from '@/lib/actions'
import { ICON_SIZE_PX } from '@/lib/constants'

export const AddBoardCard = () => {
	const navigate = useNavigate()
	const [isEditing, setIsEditing] = useState(false)
	const [title, setTitle] = useState('')
	const cancelledRef = useRef(false)
	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (isEditing) {
			inputRef.current?.focus()
		}
	}, [isEditing])

	const startEditing = () => {
		setTitle('')
		setIsEditing(true)
	}

	const handleBlur = () => {
		setIsEditing(false)

		if (cancelledRef.current) {
			cancelledRef.current = false
			return
		}

		const trimmedTitle = title.trim()
		if (!trimmedTitle) {
			return
		}

		const board = createBoard(trimmedTitle)
		navigate({ to: '/boards/$boardId', params: { boardId: board.id } })
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.currentTarget.blur()
		}
		if (e.key === 'Escape') {
			cancelledRef.current = true
			e.currentTarget.blur()
		}
	}

	if (isEditing) {
		return (
			<div className='flex h-44 w-72 shrink-0 items-center justify-center rounded-md border border-surface-400 hover:bg-surface-100 dark:bg-surface-300 dark:hover:bg-surface-200'>
				<input
					ref={inputRef}
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					onBlur={handleBlur}
					onKeyDown={handleKeyDown}
					placeholder='Board name'
					className='w-fit rounded-md border border-surface-400 bg-transparent px-3 py-2 text-sm text-typography-950 focus:outline-none'
				/>
			</div>
		)
	}

	return (
		<button
			type='button'
			onClick={startEditing}
			className='flex h-44 w-72 shrink-0 items-center justify-center rounded-md border border-surface-400 bg-surface-50 text-typography-500 transition-colors hover:bg-surface-200 hover:text-typography-600 dark:bg-surface-300'
		>
			<PlusIcon size={ICON_SIZE_PX} />
		</button>
	)
}
