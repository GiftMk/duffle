import { UserIcon } from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import { Tooltip } from '@/components/tooltip'
import { UserAvatar } from '@/components/user-avatar'
import { useSession } from '@/lib/auth-client'
import { ICON_SIZE_MD } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { SidebarButton } from './sidebar-button'

const AVATAR_FILL_SIZE = 35

export const AccountButton = () => {
	const navigate = useNavigate()
	const { data: session } = useSession()

	const handleClick = () => {
		navigate({ to: session ? '/logout' : '/login' })
	}

	return (
		<Tooltip content={session ? (session.user.name ?? 'Account') : 'Sign up'}>
			<SidebarButton
				onClick={handleClick}
				className={cn({
					'p-0': session,
				})}
			>
				{session ? (
					<UserAvatar seed={session.user.id} size={AVATAR_FILL_SIZE} />
				) : (
					<UserIcon size={ICON_SIZE_MD} />
				)}
			</SidebarButton>
		</Tooltip>
	)
}
