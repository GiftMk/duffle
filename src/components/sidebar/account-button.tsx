import { UserIcon } from '@phosphor-icons/react'
import { Tooltip } from '@/components/tooltip'
import { UserAvatar } from '@/components/user-avatar'
import { useCurrentUser } from '@/hooks/use-current-user'
import { ICON_SIZE_MD } from '@/lib/constants'
import { SIDEBAR_BUTTON_SIZE, SidebarLink } from './sidebar-button'

export const AccountButton = () => {
	const user = useCurrentUser()
	const isLinked = !!user && !user.isAnonymous

	const tooltipContent = isLinked ? (user.name ?? 'Account') : 'Save your notes'

	return (
		<Tooltip content={tooltipContent}>
			<SidebarLink to={isLinked ? '/logout' : '/login'}>
				{user ? (
					<UserAvatar seed={user.id} size={SIDEBAR_BUTTON_SIZE} />
				) : (
					<UserIcon size={ICON_SIZE_MD} />
				)}
			</SidebarLink>
		</Tooltip>
	)
}
