import { BookOpenTextIcon } from '@phosphor-icons/react'
import { Tooltip } from '@/components/tooltip'
import { ICON_SIZE_MD } from '@/lib/constants'
import { SidebarLink } from './sidebar-button'

export const NotesButton = () => {
	return (
		<Tooltip content='Notes'>
			<SidebarLink to='/notes'>
				<BookOpenTextIcon size={ICON_SIZE_MD} />
			</SidebarLink>
		</Tooltip>
	)
}
