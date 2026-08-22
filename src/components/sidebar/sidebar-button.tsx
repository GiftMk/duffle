import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export const SIDEBAR_BUTTON_SIZE = 35

export const SidebarButton = ({
	className,
	...props
}: ComponentProps<'button'>) => (
	<button
		type='button'
		className={cn(
			'flex h-[35px] w-[35px] items-center justify-center rounded-full border border-surface-400 bg-surface-100 text-typography-600 transition-transform duration-75 hover:scale-125 hover:bg-surface-300/50 focus:outline-none',
			className,
		)}
		{...props}
	/>
)
