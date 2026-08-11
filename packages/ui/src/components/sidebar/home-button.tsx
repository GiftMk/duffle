import { ICON_SIZE_MD } from '@duffle/utils/constants'
import { HouseIcon } from '@phosphor-icons/react'
import { useSidebarNavigation } from '../../sidebar-context'
import { Tooltip } from '../tooltip'
import { SidebarButton } from './sidebar-button'

export const HomeButton = () => {
	const { navigate } = useSidebarNavigation()

	const handleClick = () => {
		navigate('/')
	}

	return (
		<Tooltip content='Home'>
			<SidebarButton onClick={handleClick}>
				<HouseIcon size={ICON_SIZE_MD} />
			</SidebarButton>
		</Tooltip>
	)
}
