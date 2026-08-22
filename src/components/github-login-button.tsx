import { GithubLogoIcon } from '@phosphor-icons/react'
import type { ComponentProps } from 'react'
import { ICON_SIZE_LG } from '@/lib/constants'
import { cn } from '@/lib/utils'

type GithubLoginButtonProps = {
	loading: boolean
	compact?: boolean
	message?: string
} & Omit<ComponentProps<'button'>, 'children'>

export const GithubLoginButton = ({
	loading,
	compact = false,
	message: messageOverride,
	className,
	...props
}: GithubLoginButtonProps) => {
	const message =
		messageOverride ?? (loading ? 'Redirecting…' : 'Continue with GitHub')
	return (
		<button
			type='button'
			disabled={loading}
			className={cn(
				'flex items-center gap-2 rounded-sm border border-primary-500 px-5 py-2 transition-all duration-200 hover:scale-110 hover:bg-primary-500/10 disabled:pointer-events-none disabled:opacity-50',
				className,
			)}
			{...props}
		>
			<GithubLogoIcon
				size={ICON_SIZE_LG}
				className='fill-primary-500'
				weight='duotone'
			/>
			{!compact && message}
		</button>
	)
}
