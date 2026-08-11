import { ICON_SIZE_MD } from '@duffle/utils/constants'
import { HouseIcon } from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import { Tooltip } from '../tooltip'
import { SidebarButton } from './sidebar-button'

export const HomeButton = () => {
	const navigate = useNavigate()

	const handleClick = () => {
		navigate({ to: '/' })
	}

	return (
		<Tooltip content='Home'>
			<SidebarButton onClick={handleClick}>
				<HouseIcon size={ICON_SIZE_MD} />
			</SidebarButton>
		</Tooltip>
	)
}
