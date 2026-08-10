import { useRouterState } from '@tanstack/react-router'
import { useRef } from 'react'
import { useRoughSvg } from '@/hooks/use-rough-svg'
import { getSidebarContext } from '@/lib/utils'
import { AccountButton } from './account-button'
import { BoardsButton } from './boards-button'
import { HomeButton } from './home-button'
import { NotesButton } from './notes-button'
import { SearchDialog } from './search-dialog'
import { ThemeToggle } from './theme-toggle'

export const Sidebar = () => {
	const svgRef = useRef<SVGSVGElement | null>(null)
	const parentRef = useRef<HTMLElement | null>(null)
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	})
	const search = useRouterState({
		select: (state) => state.location.search,
	}) as { redirect?: string }
	const context = getSidebarContext(pathname, search)

	useRoughSvg(parentRef, svgRef, {
		fill: 'var(--color-surface-200)',
		fillStyle: 'zigzag',
		hachureGap: 12,
		stroke: 'var(--color-surface-300)',
		strokeWidth: 0.5,
	})

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
				<HomeButton />
				<SearchDialog scope={context} />
				{context === 'boards' ? (
					<BoardsButton active={pathname.startsWith('/boards')} />
				) : (
					<NotesButton active={pathname.startsWith('/notes')} />
				)}
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
