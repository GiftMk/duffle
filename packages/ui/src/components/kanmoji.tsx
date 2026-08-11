import { cn } from '@duffle/utils'
import type { ComponentProps } from 'react'

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
