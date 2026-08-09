import { CheckSquareIcon } from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import { ICON_SIZE_MD } from '@/lib/constants'
import { Tooltip } from '../tooltip'

type BoardsButtonProps = {
	active?: boolean
}

export const BoardsButton = ({ active }: BoardsButtonProps) => {
	const navigate = useNavigate()

	const handleClick = () => {
		navigate({ to: '/boards' })
	}

	return (
		<Tooltip content='Boards'>
			<button
				onClick={handleClick}
				type='button'
				className='flex h-fit w-fit items-center justify-center rounded-full border border-surface-400 bg-surface-100 p-2 text-typography-600 transition-all duration-75 hover:scale-125 hover:bg-surface-300/50 focus:outline-none'
			>
				<CheckSquareIcon
					weight={active ? 'duotone' : 'regular'}
					size={ICON_SIZE_MD}
				/>
			</button>
		</Tooltip>
	)
}
