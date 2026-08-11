import { cn } from '@duffle/utils'
import type { ComponentProps } from 'react'

export const SidebarButton = ({
	className,
	...props
}: ComponentProps<'button'>) => (
	<button
		type='button'
		className={cn(
			'flex h-fit w-fit items-center justify-center rounded-full border border-surface-400 bg-surface-100 p-2 text-typography-600 transition-all duration-75 hover:scale-125 hover:bg-surface-300/50 focus:outline-none',
			className,
		)}
		{...props}
	/>
)
