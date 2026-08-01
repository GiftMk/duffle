import { useNavigate } from '@tanstack/react-router'
import type { BoardEntity } from '@/state/boards-store'

type BoardCardProps = {
	board: BoardEntity
}

export const BoardCard = ({ board }: BoardCardProps) => {
	const navigate = useNavigate()

	const handleClick = () => {
		navigate({ to: '/boards/$boardId', params: { boardId: board.id } })
	}

	return (
		<button
			type='button'
			onClick={handleClick}
			className='flex h-44 w-72 shrink-0 items-center justify-center rounded-md border border-surface-400 bg-surface-50 px-4 text-sm text-typography-950 transition-colors hover:bg-surface-100 dark:bg-surface-300 dark:hover:bg-surface-200'
		>
			<span className='line-clamp-2 text-center'>{board.title}</span>
		</button>
	)
}
