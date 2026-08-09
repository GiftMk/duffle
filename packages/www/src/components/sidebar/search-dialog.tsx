import { Autocomplete, Dialog } from '@base-ui/react'
import {
	CheckSquareOffsetIcon,
	KanbanIcon,
	MagnifyingGlassIcon,
	ScrollIcon,
	XIcon,
} from '@phosphor-icons/react'
import { useHotkey } from '@tanstack/react-hotkeys'
import { useNavigate } from '@tanstack/react-router'
import { Fragment, useState } from 'react'
import { Tooltip } from '@/components/tooltip'
import { useRecentSearchResults, useSearch } from '@/hooks/search'
import { ICON_SIZE_MD, ICON_SIZE_SM } from '@/lib/constants'
import type { SearchResult as SearchResultItem } from '@/lib/search.worker'

const RECENT_RESULTS_LIMIT = 3

export const SearchDialog = () => {
	const [open, setOpen] = useState(false)
	const { query, setQuery, results, isSearching, clear } = useSearch()
	const recentResults = useRecentSearchResults(RECENT_RESULTS_LIMIT)

	const hasQuery = query.length > 0
	const items = hasQuery ? results : recentResults
	const showNoResults = hasQuery && !isSearching && results.length === 0

	const handleOpenChange = (open: boolean) => {
		setOpen(open)
		if (!open) {
			clear()
		}
	}

	const closeDialog = () => {
		handleOpenChange(false)
	}

	useHotkey('Mod+K', () => setOpen(true))

	return (
		<Dialog.Root open={open} onOpenChange={handleOpenChange}>
			<Tooltip content='Search'>
				<Dialog.Trigger
					render={
						<button
							type='button'
							className='flex h-fit w-fit items-center justify-center rounded-full border border-surface-400 bg-surface-100 p-2 text-typography-600 transition-all duration-75 hover:scale-125 hover:bg-surface-300/50 focus:outline-none'
						>
							<MagnifyingGlassIcon size={ICON_SIZE_MD} />
						</button>
					}
				/>
			</Tooltip>
			<Dialog.Portal>
				<Dialog.Popup className='fixed top-44 left-1/2 w-2xl -translate-x-1/2 rounded-md border border-surface-400 bg-surface-100 py-4 shadow-2xl shadow-surface-400/50 focus:outline-none'>
					<Dialog.Close
						onClick={closeDialog}
						className='absolute top-2 right-2 rounded-full p-1.5 text-surface-800 hover:bg-surface-300'
					>
						<XIcon size={ICON_SIZE_MD} weight='bold' />
					</Dialog.Close>
					<Autocomplete.Root
						value={query}
						onValueChange={setQuery}
						items={items}
						autoHighlight={'always'}
					>
						<span className='flex w-full items-center gap-3 px-4 py-4'>
							<Autocomplete.Input
								autoFocus
								className='h-full w-full border-surface-400 border-b py-2 focus:outline-none'
								placeholder={'Search boards, notes, and tasks...'}
							/>
						</span>
						<Autocomplete.List className='flex max-h-[min(432px,35svh)] flex-col overflow-y-auto px-4'>
							{showNoResults ? (
								<p className='px-4 py-6 text-center text-typography-600'>
									No results found.
								</p>
							) : (
								items.map((item) => (
									<Fragment key={item.id}>
										<SearchResult item={item} onClick={closeDialog} />
										<hr className='my-2 text-surface-400' />
									</Fragment>
								))
							)}
						</Autocomplete.List>
					</Autocomplete.Root>
				</Dialog.Popup>
			</Dialog.Portal>
		</Dialog.Root>
	)
}

type SearchResultIconProps = {
	type: SearchResultItem['type']
}

const SearchResultIcon = ({ type }: SearchResultIconProps) => {
	let Icon = KanbanIcon

	if (type === 'note') {
		Icon = ScrollIcon
	} else if (type === 'task') {
		Icon = CheckSquareOffsetIcon
	}

	return <Icon size={ICON_SIZE_SM} className='shrink-0 text-typography-600' />
}

type SearchResultProps = {
	item: SearchResultItem
	onClick?: () => void
}

const SearchResult = ({ item, onClick }: SearchResultProps) => {
	const navigate = useNavigate()

	const handleClick = () => {
		onClick?.()

		if (item.type === 'note') {
			navigate({ to: '/notes/$noteId', params: { noteId: item.id } })
		} else if (item.boardId) {
			navigate({ to: '/boards/$boardId', params: { boardId: item.boardId } })
		}
	}

	return (
		<Autocomplete.Item
			onClick={handleClick}
			className='flex w-full items-center gap-2 rounded-md px-4 py-3 data-highlighted:bg-surface-300/70'
		>
			<SearchResultIcon type={item.type} />
			<p>{item.title}</p>
		</Autocomplete.Item>
	)
}
