import { UserIcon } from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import { Tooltip } from '@/components/tooltip'
import { UserAvatar } from '@/components/user-avatar'
import { useCurrentUser } from '@/hooks/use-current-user'
import { ICON_SIZE_MD } from '@/lib/constants'
import { SIDEBAR_BUTTON_SIZE, SidebarButton } from './sidebar-button'

export const AccountButton = () => {
	const navigate = useNavigate()
	const user = useCurrentUser()
	const isLinked = !!user && !user.isAnonymous

	const handleClick = () => {
		navigate({ to: isLinked ? '/logout' : '/login' })
	}

	const tooltipContent = isLinked ? (user.name ?? 'Account') : 'Save your notes'

	return (
		<Tooltip content={tooltipContent}>
			<SidebarButton onClick={handleClick}>
				{user ? (
					<UserAvatar seed={user.id} size={SIDEBAR_BUTTON_SIZE} />
				) : (
					<UserIcon size={ICON_SIZE_MD} />
				)}
			</SidebarButton>
		</Tooltip>
	)
}
