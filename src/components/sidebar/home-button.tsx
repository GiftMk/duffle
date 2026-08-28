import { HouseIcon } from '@phosphor-icons/react'
import { Tooltip } from '@/components/tooltip'
import { ICON_SIZE_MD } from '@/lib/constants'
import { SidebarLink } from './sidebar-button'

export const HomeButton = () => {
	return (
		<Tooltip content='Home'>
			<SidebarLink to='/'>
				<HouseIcon size={ICON_SIZE_MD} />
			</SidebarLink>
		</Tooltip>
	)
}
