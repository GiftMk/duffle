import { type Autocomplete, Dialog } from '@base-ui/react'
import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { useHotkey } from '@tanstack/react-hotkeys'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { SearchDialog } from '@/components/search/search-dialog'
import { Tooltip } from '@/components/tooltip'
import { useSearch } from '@/hooks/search'
import { ICON_SIZE_MD } from '@/lib/constants'
import type { NoteEntity } from '@/lib/schemas'
import { SidebarButton } from './sidebar-button'

export const SearchButton = () => {
	const [open, setOpenState] = useState(false)
	const navigate = useNavigate()
	const { query, setQuery, results, state, isRefreshing, clear } = useSearch()

	const setOpen = (nextOpen: boolean) => {
		setOpenState(nextOpen)
		if (!nextOpen) clear()
	}

	const close = () => setOpen(false)

	const handleValueChange = (
		value: string,
		details: Autocomplete.Root.ChangeEventDetails,
	) => {
		if (details.reason === 'item-press') return
		setQuery(value)
	}

	const selectNote = (note: NoteEntity) => {
		close()
		navigate({ to: '/notes/$noteId', params: { noteId: note.id } })
	}

	useHotkey('Mod+K', () => {
		setOpen(true)
	})

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Tooltip content='Search'>
				<Dialog.Trigger
					render={
						<SidebarButton>
							<MagnifyingGlassIcon size={ICON_SIZE_MD} />
						</SidebarButton>
					}
				/>
			</Tooltip>
			<SearchDialog
				query={query}
				onValueChange={handleValueChange}
				items={results}
				state={state}
				isRefreshing={isRefreshing}
				onSelect={selectNote}
			/>
		</Dialog.Root>
	)
}
