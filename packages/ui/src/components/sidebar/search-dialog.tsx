import { Autocomplete, Dialog } from '@base-ui/react'
import { cn } from '@duffle/utils'
import { ICON_SIZE_MD } from '@duffle/utils/constants'
import { MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react'
import { useHotkey } from '@tanstack/react-hotkeys'
import { Fragment, type ReactNode, useState } from 'react'
import { Tooltip } from '../tooltip'
import { SidebarButton } from './sidebar-button'

type SearchDialogProps<TItem> = {
	disabled?: boolean
	placeholder: string
	query: string
	onQueryChange: (query: string) => void
	items: TItem[]
	isSearching: boolean
	getItemKey: (item: TItem) => string
	renderItem: (item: TItem, options: { onSelect: () => void }) => ReactNode
	onClear?: () => void
}

export const SearchDialog = <TItem,>({
	disabled,
	placeholder,
	query,
	onQueryChange,
	items,
	isSearching,
	getItemKey,
	renderItem,
	onClear,
}: SearchDialogProps<TItem>) => {
	const [open, setOpen] = useState(false)

	const hasQuery = query.length > 0
	const showNoResults = hasQuery && !isSearching && items.length === 0

	const handleOpenChange = (nextOpen: boolean) => {
		if (disabled) return

		setOpen(nextOpen)
		if (!nextOpen) {
			onClear?.()
		}
	}

	const closeDialog = () => {
		handleOpenChange(false)
	}

	useHotkey('Mod+K', () => {
		if (!disabled) setOpen(true)
	})

	return (
		<Dialog.Root open={open} onOpenChange={handleOpenChange}>
			<Tooltip content='Search'>
				<Dialog.Trigger
					render={
						<SidebarButton
							disabled={disabled}
							aria-disabled={disabled}
							className={cn({ 'pointer-events-none opacity-40': disabled })}
						>
							<MagnifyingGlassIcon size={ICON_SIZE_MD} />
						</SidebarButton>
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
						onValueChange={onQueryChange}
						items={items}
						autoHighlight={'always'}
					>
						<span className='flex w-full items-center gap-3 px-4 py-4'>
							<Autocomplete.Input
								autoFocus
								className='h-full w-full border-surface-400 border-b py-2 focus:outline-none'
								placeholder={placeholder}
							/>
						</span>
						<Autocomplete.List className='flex max-h-[min(432px,35svh)] flex-col overflow-y-auto px-4'>
							{showNoResults ? (
								<p className='px-4 py-6 text-center text-typography-600'>
									No results found.
								</p>
							) : (
								items.map((item) => (
									<Fragment key={getItemKey(item)}>
										{renderItem(item, { onSelect: closeDialog })}
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

type SearchResultItemProps = {
	icon: ReactNode
	title: string
	onClick?: () => void
}

export const SearchResultItem = ({
	icon,
	title,
	onClick,
}: SearchResultItemProps) => {
	return (
		<Autocomplete.Item
			onClick={onClick}
			className='flex w-full items-center gap-2 rounded-md px-4 py-3 data-highlighted:bg-surface-300/70'
		>
			{icon}
			<p>{title}</p>
		</Autocomplete.Item>
	)
}
