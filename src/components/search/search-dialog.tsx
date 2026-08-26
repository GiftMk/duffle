import { Autocomplete, Dialog } from '@base-ui/react'
import {
	MagnifyingGlassIcon,
	SpinnerGapIcon,
	XIcon,
} from '@phosphor-icons/react'
import { SearchResultsGrid } from '@/components/search/search-results-grid'
import type { SearchState } from '@/hooks/search'
import { ICON_SIZE_MD } from '@/lib/constants'
import type { NoteEntity } from '@/lib/schemas'

const noteToStringValue = (note: NoteEntity) => note.title

const resolveStatusMessage = (
	state: SearchState,
	resultCount: number,
): string => {
	if (state === 'loading') return 'Searching…'
	if (state === 'results') {
		return `${resultCount} result${resultCount === 1 ? '' : 's'} found`
	}
	if (state === 'empty') return 'No results found'
	return ''
}

type SearchDialogProps = {
	query: string
	onValueChange: (
		value: string,
		details: Autocomplete.Root.ChangeEventDetails,
	) => void
	items: NoteEntity[]
	state: SearchState
	isRefreshing: boolean
	onSelect: (note: NoteEntity) => void
}

export const SearchDialog = ({
	query,
	onValueChange,
	items,
	state,
	isRefreshing,
	onSelect,
}: SearchDialogProps) => {
	const statusMessage = resolveStatusMessage(state, items.length)

	return (
		<Dialog.Portal>
			<Dialog.Backdrop className='fixed inset-0 bg-surface-950/20' />
			<Dialog.Popup className='fixed inset-4 flex flex-col overflow-hidden rounded-md border border-surface-400 bg-surface-100 shadow-2xl shadow-surface-400/50 focus:outline-none md:inset-8'>
				<Autocomplete.Root
					inline
					open
					grid
					filter={null}
					items={items}
					value={query}
					onValueChange={onValueChange}
					itemToStringValue={noteToStringValue}
					autoHighlight
				>
					<header className='flex shrink-0 items-center gap-3 border-surface-400 border-b px-8 py-4'>
						<MagnifyingGlassIcon
							size={ICON_SIZE_MD}
							className='shrink-0 text-surface-800'
						/>
						<Autocomplete.Input
							autoFocus
							placeholder='Search notes...'
							className='w-full focus:outline-none'
						/>
						{isRefreshing && (
							<SpinnerGapIcon
								size={ICON_SIZE_MD}
								className='shrink-0 animate-spin text-surface-600'
							/>
						)}
						<Dialog.Close className='shrink-0 rounded-full p-1.5 text-surface-800 hover:bg-surface-300'>
							<XIcon size={ICON_SIZE_MD} weight='bold' />
						</Dialog.Close>
					</header>

					<Autocomplete.Status className='sr-only'>
						{statusMessage}
					</Autocomplete.Status>

					<Autocomplete.List className='min-h-0 flex-1 overflow-y-auto px-8 py-6'>
						<SearchResultsGrid
							items={items}
							state={state}
							onSelect={onSelect}
						/>
					</Autocomplete.List>
				</Autocomplete.Root>
			</Dialog.Popup>
		</Dialog.Portal>
	)
}
