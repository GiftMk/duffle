import { cn } from '@duffle/utils'
import { ICON_SIZE_MD } from '@duffle/utils/constants'
import { UserIcon } from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import { useSession } from '../../auth'
import { Tooltip } from '../tooltip'
import { UserAvatar } from '../user-avatar'
import { SidebarButton } from './sidebar-button'

const AVATAR_FILL_SIZE = 35

type AccountButtonProps = {
	active?: boolean
}

export const AccountButton = ({ active }: AccountButtonProps) => {
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
					'scale-125 bg-surface-200': active,
				})}
			>
				{session ? (
					<UserAvatar
						active={active}
						seed={session.user.id}
						size={AVATAR_FILL_SIZE}
					/>
				) : (
					<UserIcon size={ICON_SIZE_MD} />
				)}
			</SidebarButton>
		</Tooltip>
	)
}
