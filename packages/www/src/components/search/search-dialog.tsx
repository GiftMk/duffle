import { Input } from '@base-ui/react'
import { Dialog } from '@base-ui/react/dialog'
import { XIcon } from '@phosphor-icons/react'
import { useHotkey } from '@tanstack/react-hotkeys'
import { Link } from '@tanstack/react-router'
import { Fragment, useEffect, useState } from 'react'
import { miniSearch, type SearchItem } from '@/lib/db'
import { cn } from '@/lib/utils'
import { InputSwitch, type InputSwitchMode } from './input-switch'
import { TelescopeIcon } from './telescope-icon'

export const SearchDialog = () => {
	const [open, setOpen] = useState(false)
	const [mode, setMode] = useState<InputSwitchMode>('search')
	const [query, setQuery] = useState('')
	const [results, setResults] = useState<SearchItem[]>([])

	const closeDialog = () => {
		setOpen(false)
		setQuery('')
	}

	useHotkey('Mod+K', () => setOpen(true))

	useEffect(() => {
		if (!query.length) {
			return
		}

		const results = miniSearch.search(query)
		// biome-ignore lint/suspicious/noExplicitAny: minisearch returns items as any
		setResults(results as any as SearchItem[])
	}, [query])

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Trigger
				render={
					<button
						type='button'
						className='flex h-fit w-fit items-center justify-center rounded-full border border-surface-400 bg-surface-100 p-2 text-typography-600 hover:bg-surface-300/50 focus:outline-none'
					>
						<TelescopeIcon />
					</button>
				}
			/>
			<Dialog.Portal>
				<Dialog.Popup className='fixed top-44 left-1/2 w-2xl -translate-x-1/2 rounded-md border border-surface-400 bg-surface-100 py-4 shadow-2xl shadow-surface-400/50 focus:outline-none'>
					<Dialog.Close
						onClick={closeDialog}
						className='absolute top-2 right-2 rounded-full p-1.5 text-surface-800 hover:bg-surface-300'
					>
						<XIcon size={18} />
					</Dialog.Close>
					<span className='flex w-full items-center gap-3 px-4 py-2'>
						<InputSwitch mode={mode} setMode={setMode} />
						<Input
							value={query}
							onValueChange={setQuery}
							autoFocus
							className='h-full w-full border-surface-400 border-b py-2 focus:outline-none'
							placeholder={'Search, ask...'}
						/>
					</span>
					<ul className='flex max-h-[min(432px,35svh)] flex-col overflow-y-auto px-4'>
						{results.map((note) => (
							<Fragment key={note.id}>
								<SearchResult item={note} onClick={closeDialog} />
								<hr className='my-2 text-surface-400' />
							</Fragment>
						))}
					</ul>
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
	return (
		<li>
			<Link
				to='/notes/$noteId'
				params={{ noteId: item.id }}
				onClick={onClick}
				className='flex w-full flex-col gap-4 rounded-md px-4 pt-6 pb-3 hover:bg-surface-300/70'
			>
				<p
					className={cn('font-bold text-lg', {
						'opacity-30': item.title.length === 0,
					})}
				>
					{item.title.length > 0 ? item.title : 'Untitled'}
				</p>
				<p className='line-clamp-2 text-typography-500 text-xs'>{item.body}</p>
			</Link>
		</li>
	)
}
