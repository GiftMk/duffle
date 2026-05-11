import type { ComponentProps } from 'react'
import { cn } from '../lib/utils'

export const Kanmoji = ({
	children,
	className,
	...props
}: ComponentProps<'span'>) => {
	return (
		<span className={cn('text-nowrap', className)} {...props}>
			{children}
		</span>
	)
}
