import { Dialog } from '@base-ui/react'
import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { SearchDialog } from '@/components/search/search-dialog'
import { Tooltip } from '@/components/tooltip'
import { useSearchDialog } from '@/hooks/search'
import { ICON_SIZE_MD } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { SidebarButton } from './sidebar-button'

type SearchButtonProps = {
	disabled?: boolean
}

export const SearchButton = ({ disabled }: SearchButtonProps) => {
	const {
		open,
		setOpen,
		query,
		handleValueChange,
		items,
		state,
		isRefreshing,
		selectNote,
	} = useSearchDialog({ disabled })

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
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
