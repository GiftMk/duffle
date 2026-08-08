import { BooksIcon } from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import { Tooltip } from '@/components/tooltip'
import { ICON_SIZE_MD } from '@/lib/constants'

export const NotesButton = () => {
	const navigate = useNavigate()

	const handleClick = () => {
		navigate({ to: '/notes' })
	}

	return (
		<Tooltip content='Notes'>
			<button
				onClick={handleClick}
				type='button'
				className='flex h-fit w-fit items-center justify-center rounded-full border border-surface-400 bg-surface-100 p-2 text-typography-600 transition-all duration-75 hover:scale-125 hover:bg-surface-300/50 focus:outline-none'
			>
				<BooksIcon size={ICON_SIZE_MD} />
			</button>
		</Tooltip>
	)
}
