import { HouseIcon } from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import { Tooltip } from '@/components/tooltip'
import { ICON_SIZE_MD } from '@/lib/constants'
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
