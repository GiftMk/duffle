import { Autocomplete, Dialog } from '@base-ui/react'
import { MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react'
import { useHotkey } from '@tanstack/react-hotkeys'
import { useNavigate } from '@tanstack/react-router'
import { Fragment, useEffect, useState } from 'react'
import { Tooltip } from '@/components/tooltip'
import { useSearch } from '@/hooks/search'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { ICON_SIZE_MD } from '@/lib/constants'
import type { SearchResult } from '@/lib/schemas'

const SEARCH_DEBOUNCE_MS = 250

export const SearchDialog = () => {
	const [open, setOpen] = useState(false)
	const [query, setQuery] = useState('')
	const debouncedQuery = useDebouncedValue(query, SEARCH_DEBOUNCE_MS)
	const { data: results = [] } = useSearch(debouncedQuery)
	const navigate = useNavigate()

	const closeDialog = () => {
		setOpen(false)
	}

	const handleSelect = (item: SearchResult) => {
		closeDialog()
		if (item.type === 'note') {
			navigate({ to: '/notes/$noteId', params: { noteId: item.id } })
			return
		}
		navigate({ to: '/boards/$boardId', params: { boardId: item.boardId } })
	}

	useHotkey('Mod+K', () => setOpen(true))

	useEffect(() => {
		if (!open) {
			setQuery('')
		}
	}, [open])

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
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
						mode='none'
						value={query}
						onValueChange={setQuery}
						items={results}
						autoHighlight={'always'}
					>
						<span className='flex w-full items-center gap-3 px-4 py-4'>
							<Autocomplete.Input
								autoFocus
								className='h-full w-full border-surface-400 border-b py-2 focus:outline-none'
								placeholder={'Search notes and cards...'}
							/>
						</span>
						<Autocomplete.List className='flex max-h-[min(432px,35svh)] flex-col overflow-y-auto px-4'>
							{results.map((item, index) => (
								<Fragment key={item.id}>
									<SearchResultItem
										item={item}
										index={index}
										onClick={handleSelect}
									/>
									<hr className='my-2 text-surface-400' />
								</Fragment>
							))}
						</Autocomplete.List>
					</Autocomplete.Root>
				</Dialog.Popup>
			</Dialog.Portal>
		</Dialog.Root>
	)
}

type SearchResultItemProps = {
	item: SearchResult
	index: number
	onClick: (item: SearchResult) => void
}

const SearchResultItem = ({ item, index, onClick }: SearchResultItemProps) => {
	const handleClick = () => {
		onClick(item)
	}

	return (
		<Autocomplete.Item
			value={item.id}
			index={index}
			onClick={handleClick}
			className='flex w-full items-center gap-2 rounded-md px-4 py-3 data-highlighted:bg-surface-300/70'
		>
			<span className='rounded-full border border-surface-400 px-2 py-0.5 text-typography-500 text-xs uppercase'>
				{item.type}
			</span>
			<p className='font-bold text-lg'>{item.title}</p>
		</Autocomplete.Item>
	)
}
