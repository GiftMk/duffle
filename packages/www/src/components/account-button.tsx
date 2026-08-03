import { UserIcon } from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import { authClient } from '@/lib/auth'
import { ICON_SIZE_MD } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Tooltip } from './tooltip'
import { UserAvatar } from './user-avatar'

const AVATAR_FILL_SIZE = 35

export const AccountButton = () => {
	const navigate = useNavigate()
	const { data: session } = authClient.useSession()

	const handleClick = () => {
		navigate({ to: session ? '/sign-out' : '/sign-up' })
	}

	return (
		<Tooltip content={session ? (session.user.name ?? 'Account') : 'Sign up'}>
			<button
				onClick={handleClick}
				type='button'
				className={cn(
					'flex h-fit w-fit items-center justify-center rounded-full border border-surface-400 bg-surface-100 p-2 text-typography-600 transition-all duration-75 hover:scale-125 hover:bg-surface-300/50 focus:outline-none',
					session && 'p-0',
				)}
			>
				{session ? (
					<UserAvatar seed={session.user.id} size={AVATAR_FILL_SIZE} />
				) : (
					<UserIcon size={ICON_SIZE_MD} />
				)}
			</button>
		</Tooltip>
	)
}
