import { Autocomplete } from '@base-ui/react'
import { useRef } from 'react'
import { SearchResultCard } from '@/components/search/search-result-card'
import { SearchSkeletonCard } from '@/components/search/search-skeleton-card'
import { type SearchState, useGridColumns } from '@/hooks/search'
import type { NoteEntity } from '@/lib/schemas'
import { chunk } from '@/lib/utils'

const GRID_COLUMN_OPTIONS = { minCardWidth: 260, gap: 24, maxColumns: 5 }
const SKELETON_ROW_COUNT = 2

const getEmptyMessage = (state: SearchState): string | null => {
	if (state === 'empty') return 'No results found.'
	if (state === 'recent') return `ᕙ( •̀ ᗜ •́ )ᕗ ready, set, go!`
	return null
}

const getHeadingMessage = (state: SearchState, resultCount: number): string => {
	if (state === 'recent') return 'Recent'
	return `${resultCount} ${resultCount === 1 ? 'Result' : 'Results'}`
}

type SearchResultsGridProps = {
	items: NoteEntity[]
	state: SearchState
	onSelect: (note: NoteEntity) => void
}

export const SearchResultsGrid = ({
	items,
	state,
	onSelect,
}: SearchResultsGridProps) => {
	const gridRef = useRef<HTMLDivElement>(null)
	const columns = useGridColumns(gridRef, GRID_COLUMN_OPTIONS)

	const heading = getHeadingMessage(state, items.length)
	const emptyMessage = getEmptyMessage(state)

	return (
		<div ref={gridRef}>
			<Autocomplete.Empty>
				{emptyMessage && (
					<p className='px-4 py-16 text-center text-typography-600'>
						{emptyMessage}
					</p>
				)}
			</Autocomplete.Empty>

			{state === 'loading' && (
				<SearchSkeletonGrid columns={columns} rows={SKELETON_ROW_COUNT} />
			)}

			{(state === 'recent' || state === 'results') && items.length > 0 && (
				<div className='flex flex-col gap-6'>
					<h2 className='font-semibold text-typography-600 text-xs tracking-wide'>
						{heading}
					</h2>
					<SearchResultRows
						items={items}
						columns={columns}
						onSelect={onSelect}
					/>
				</div>
			)}
		</div>
	)
}

type SearchResultRowsProps = {
	items: NoteEntity[]
	columns: number
	onSelect: (note: NoteEntity) => void
}

const SearchResultRows = ({
	items,
	columns,
	onSelect,
}: SearchResultRowsProps) => {
	const rows = chunk(items, columns)

	return (
		<div className='flex flex-col gap-6'>
			{rows.map((row, i) => (
				<Autocomplete.Row
					// biome-ignore lint/suspicious/noArrayIndexKey: rows indexes are stable
					key={`row-${i}`}
					className='grid gap-6'
					style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
				>
					{row.map((note, j) => (
						<SearchResultCard
							key={note.id}
							note={note}
							index={i * columns + j}
							onSelect={onSelect}
						/>
					))}
				</Autocomplete.Row>
			))}
		</div>
	)
}

type SearchSkeletonGridProps = {
	columns: number
	rows: number
}

const SearchSkeletonGrid = ({ columns, rows }: SearchSkeletonGridProps) => {
	const cardCount = columns * rows

	return (
		<div
			className='grid gap-6'
			style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
		>
			{Array.from({ length: cardCount }, (_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: indexes are stable
				<SearchSkeletonCard key={i} />
			))}
		</div>
	)
}
