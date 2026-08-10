import type { Icon } from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import { ICON_SIZE_XL } from '@/lib/constants'

type LandingNavButtonProps = {
	icon: Icon
	label: string
	to?: string
	onClick?: () => void
}

export const LandingNavButton = ({
	icon: IconComponent,
	label,
	to,
	onClick,
}: LandingNavButtonProps) => {
	const navigate = useNavigate()

	const handleClick = () => {
		if (onClick) {
			onClick()
			return
		}
		if (to) navigate({ to })
	}

	return (
		<button
			onClick={handleClick}
			type='button'
			className='flex flex-col items-center gap-3 focus:outline-none'
		>
			<span className='flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary-500 text-primary-500 transition-all duration-200 hover:scale-110 hover:bg-primary-500/10 focus-visible:scale-110 focus-visible:bg-primary-500/10'>
				<IconComponent size={ICON_SIZE_XL} weight='duotone' />
			</span>
			<span className='font-drawn text-lg text-typography-600 tracking-tight'>
				{label}
			</span>
		</button>
	)
}
