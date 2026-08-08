import { SquaresFourIcon } from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import { useRef } from 'react'
import { useRoughSvg } from '@/hooks/use-rough-svg'
import { ICON_SIZE_MD } from '@/lib/constants'
import { Tooltip } from '../tooltip'
import { AccountButton } from './account-button'
import { NewNoteButton } from './new-note-button'
import { SearchDialog } from './search-dialog'
import { ThemeToggle } from './theme-toggle'

export const Sidebar = () => {
	const svgRef = useRef<SVGSVGElement | null>(null)
	const parentRef = useRef<HTMLElement | null>(null)
	const navigate = useNavigate()

	useRoughSvg(parentRef, svgRef, {
		fill: 'var(--color-surface-200)',
		fillStyle: 'zigzag',
		hachureGap: 12,
		stroke: 'var(--color-surface-300)',
		strokeWidth: 0.5,
	})

	const handleBoardsClick = () => {
		navigate({ to: '/boards' })
	}

	return (
		<aside
			ref={parentRef}
			className='relative flex h-full w-fit flex-col justify-between border-surface-400 border-r bg-surface-100 px-2 py-4'
		>
			<svg
				ref={svgRef}
				className='absolute inset-0 h-full w-full opacity-100'
			/>
			<section className='relative flex flex-col items-center gap-4'>
				<SearchDialog />
				<NewNoteButton />
				<Tooltip content='Boards'>
					<button
						onClick={handleBoardsClick}
						type='button'
						className='flex h-fit w-fit items-center justify-center rounded-full border border-surface-400 bg-surface-100 p-2 text-typography-600 transition-all duration-75 hover:scale-125 hover:bg-surface-300/50 focus:outline-none'
					>
						<SquaresFourIcon size={ICON_SIZE_MD} />
					</button>
				</Tooltip>
				<ThemeToggle />
				<AccountButton />
			</section>
			<section className='relative flex justify-center'>
				<h2 className='rotate-180 font-bold text-sm text-typography-500/75 tracking-tight [writing-mode:vertical-rl]'>
					Duffle.
				</h2>
			</section>
		</aside>
	)
}
