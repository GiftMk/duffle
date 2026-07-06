import { Autocomplete, Dialog } from '@base-ui/react'
import { MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react'
import { useHotkey } from '@tanstack/react-hotkeys'
import { useNavigate } from '@tanstack/react-router'
import { Fragment, useEffect, useState } from 'react'
import { useWorker } from '@/hooks/use-worker'
import { ICON_SIZE_PX } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { searchWorker } from '@/workers/search'
import type { SearchItem } from '@/workers/search.worker'
import { InputSwitch, type InputSwitchMode } from './input-switch'

export const SearchDialog = () => {
	const [open, setOpen] = useState(false)
	const [mode, setMode] = useState<InputSwitchMode>('search')
	const [query, setQuery] = useState('')
	const [results, setResults] = useState<SearchItem[]>([])

	const closeDialog = () => {
		setOpen(false)
	}

	useHotkey('Mod+K', () => setOpen(true))

	useWorker(searchWorker, (response) => {
		if (response.type !== 'query') {
			return
		}

		setResults(response.payload)
	})

	useEffect(() => {
		if (!query.length) {
			return
		}

		setResults([])
		searchWorker.send({ type: 'query', payload: query })
	}, [query])

	useEffect(() => {
		if (!open) {
			setQuery('')
			setResults([])
		}
	}, [open])

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
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
			<Dialog.Portal>
				<Dialog.Popup className='fixed top-44 left-1/2 w-2xl -translate-x-1/2 rounded-md border border-surface-400 bg-surface-100 py-4 shadow-2xl shadow-surface-400/50 focus:outline-none'>
					<Dialog.Close
						onClick={closeDialog}
						className='absolute top-2 right-2 rounded-full p-1.5 text-surface-800 hover:bg-surface-300'
					>
						<XIcon size={ICON_SIZE_PX} />
					</Dialog.Close>
					<Autocomplete.Root
						value={query}
						onValueChange={setQuery}
						items={results}
						autoHighlight={'always'}
					>
						<span className='flex w-full items-center gap-3 px-4 py-4'>
							<InputSwitch mode={mode} setMode={setMode} />
							<Autocomplete.Input
								autoFocus
								className='h-full w-full border-surface-400 border-b py-2 focus:outline-none'
								placeholder={'Search, ask...'}
							/>
						</span>
						<Autocomplete.List className='flex max-h-[min(432px,35svh)] flex-col overflow-y-auto px-4'>
							{results.map((note) => (
								<Fragment key={note.id}>
									<SearchResult item={note} onClick={closeDialog} />
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
	const navigate = useNavigate()
	const handleClick = () => {
		navigate({ to: '/notes/$noteId', params: { noteId: item.id } })
		onClick?.()
	}

	return (
		<Autocomplete.Item
			onClick={handleClick}
			className='flex w-full flex-col gap-4 rounded-md px-4 pt-6 pb-3 data-highlighted:bg-surface-300/70'
		>
			<p
				className={cn('font-bold text-lg', {
					'opacity-30': item.title.length === 0,
				})}
			>
				{item.title.length > 0 ? item.title : 'Untitled'}
			</p>
			<p className='line-clamp-2 text-typography-500 text-xs'>{item.body}</p>
		</Autocomplete.Item>
	)
}
