import { KanbanIcon } from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import { ICON_SIZE_MD } from '@/lib/constants'
import { Tooltip } from '../tooltip'

export const BoardsButton = () => {
	const navigate = useNavigate()

	const handleClick = () => {
		navigate({ to: '/boards' })
	}

	return (
		<Tooltip content='Boards'>
			<button
				onClick={handleClick}
				type='button'
				className='flex h-fit w-fit scale-125 items-center justify-center rounded-full border border-surface-400 bg-surface-100 p-2 text-typography-600 transition-all duration-75 hover:scale-125 hover:bg-surface-300/50 focus:outline-none'
			>
				<KanbanIcon size={ICON_SIZE_MD} />
			</button>
		</Tooltip>
	)
}
