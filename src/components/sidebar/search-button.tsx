import { Dialog } from '@base-ui/react'
import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { SearchDialog } from '@/components/search/search-dialog'
import { Tooltip } from '@/components/tooltip'
import { useSearchDialog } from '@/hooks/search'
import { ICON_SIZE_MD } from '@/lib/constants'
import { SidebarButton } from './sidebar-button'

export const SearchButton = () => {
	const {
		open,
		setOpen,
		query,
		handleValueChange,
		items,
		state,
		isRefreshing,
		selectNote,
	} = useSearchDialog()

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
				items={items}
				state={state}
				isRefreshing={isRefreshing}
				onSelect={selectNote}
			/>
		</Dialog.Root>
	)
}
