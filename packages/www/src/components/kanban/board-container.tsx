import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export const BoardContainer = ({
	className,
	...props
}: ComponentProps<'div'>) => {
	return (
		<div
			className={cn(
				'flex h-44 w-72 shrink-0 items-center justify-center rounded-md border border-surface-400 hover:bg-surface-100 dark:bg-surface-300 dark:hover:bg-surface-200',
				className,
			)}
			{...props}
		/>
	)
}
