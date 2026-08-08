import { DetectiveIcon } from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import { createBoard } from '@/lib/actions'
import { ICON_SIZE_LG } from '@/lib/constants'
import { useBoards } from '@/hooks/boards'

export const IncognitoButton = () => {
	const navigate = useNavigate()
	const boards = useBoards()

	const handleClick = () => {
		const board = boards[0] ?? createBoard('Getting Started')
		navigate({ to: '/boards/$boardId', params: { boardId: board.id } })
	}

	return (
		<button
			type='button'
			onClick={handleClick}
			className='flex gap-2 rounded-sm border border-primary-500 px-5 py-2 transition-all duration-200 hover:scale-110 hover:bg-primary-500/10'
		>
			<DetectiveIcon
				size={ICON_SIZE_LG}
				className='fill-primary-500'
				weight='duotone'
			/>
			Icognito Mode
		</button>
	)
}
