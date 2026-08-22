import { UserIcon } from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import { Tooltip } from '@/components/tooltip'
import { UserAvatar } from '@/components/user-avatar'
import { useCurrentSession } from '@/hooks/use-current-session'
import { ICON_SIZE_MD } from '@/lib/constants'
import { SIDEBAR_BUTTON_SIZE, SidebarButton } from './sidebar-button'

export const AccountButton = () => {
	const navigate = useNavigate()
	const session = useCurrentSession()

	const handleClick = () => {
		navigate({ to: session ? '/logout' : '/login' })
	}

	return (
		<Tooltip content={session ? (session.user.name ?? 'Account') : 'Sign up'}>
			<SidebarButton onClick={handleClick}>
				{session ? (
					<UserAvatar seed={session.user.id} size={SIDEBAR_BUTTON_SIZE} />
				) : (
					<UserIcon size={ICON_SIZE_MD} />
				)}
			</SidebarButton>
		</Tooltip>
	)
}
