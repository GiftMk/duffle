import { Autocomplete, Dialog } from '@base-ui/react'
import { MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react'
import { useHotkey } from '@tanstack/react-hotkeys'
import { Fragment, useEffect, useState } from 'react'
import { Tooltip } from '@/components/tooltip'
import { ICON_SIZE_PX } from '@/lib/constants'
import { searchWorker } from '@/workers/search'
import type { SearchItem } from '@/workers/search.worker'

export const SearchDialog = () => {
	const [open, setOpen] = useState(false)
	const [query, setQuery] = useState('')
	const [results, setResults] = useState<SearchItem[]>([])

	const closeDialog = () => {
		setOpen(false)
	}

	useHotkey('Mod+K', () => setOpen(true))

	useEffect(() => {
		if (!query.length) {
			return
		}

		setResults([])
		searchWorker.query(query).then(setResults)
	}, [query])

	useEffect(() => {
		if (!open) {
			setQuery('')
			setResults([])
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
							<MagnifyingGlassIcon size={ICON_SIZE_PX} />
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
						<XIcon size={ICON_SIZE_PX} weight='bold' />
					</Dialog.Close>
					<Autocomplete.Root
						value={query}
						onValueChange={setQuery}
						items={results}
						autoHighlight={'always'}
					>
						<span className='flex w-full items-center gap-3 px-4 py-4'>
							<Autocomplete.Input
								autoFocus
								className='h-full w-full border-surface-400 border-b py-2 focus:outline-none'
								placeholder={'Search cards...'}
							/>
						</span>
						<Autocomplete.List className='flex max-h-[min(432px,35svh)] flex-col overflow-y-auto px-4'>
							{results.map((card) => (
								<Fragment key={card.id}>
									<SearchResult item={card} onClick={closeDialog} />
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

type SearchResultProps = {
	item: SearchItem
	onClick?: () => void
}

const SearchResult = ({ item, onClick }: SearchResultProps) => {
	const handleClick = () => {
		onClick?.()
	}

	return (
		<Autocomplete.Item
			onClick={handleClick}
			className='flex w-full flex-col rounded-md px-4 py-3 data-highlighted:bg-surface-300/70'
		>
			<p className='font-bold text-lg'>{item.title}</p>
		</Autocomplete.Item>
	)
}
