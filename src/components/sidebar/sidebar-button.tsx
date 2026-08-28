import { Link, type LinkComponentProps } from '@tanstack/react-router'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export const SIDEBAR_BUTTON_SIZE = 35

const SIDEBAR_BUTTON_CLASS_NAME =
	'flex h-[35px] w-[35px] items-center justify-center rounded-full border border-surface-400 bg-surface-100 text-typography-600 transition-transform duration-75 hover:scale-125 hover:bg-surface-300/50 focus:outline-none'

export const SidebarButton = ({
	className,
	...props
}: ComponentProps<'button'>) => (
	<button
		type='button'
		className={cn(SIDEBAR_BUTTON_CLASS_NAME, className)}
		{...props}
	/>
)

export const SidebarLink = ({ className, ...props }: LinkComponentProps) => (
	<Link className={cn(SIDEBAR_BUTTON_CLASS_NAME, className)} {...props} />
)
