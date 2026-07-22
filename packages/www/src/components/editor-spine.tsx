import { useRef } from 'react'
import { useRoughSvg } from '@/hooks/use-rough-svg'
import { NewNoteButton } from './new-note-button'
import { SearchDialog } from './search/search-dialog'

export const EditorSpine = () => {
	const svgRef = useRef<SVGSVGElement | null>(null)
	const parentRef = useRef<HTMLElement | null>(null)

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
				<NewNoteButton />
				<SearchDialog />
			</section>
			<section className='relative flex justify-center'>
				<h2 className='rotate-180 font-bold text-sm text-typography-500/75 tracking-tight [writing-mode:vertical-rl]'>
					Duffle.
				</h2>
			</section>
		</aside>
	)
}
