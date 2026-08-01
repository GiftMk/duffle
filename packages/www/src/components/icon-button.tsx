import { cn } from '@/lib/utils'
import type { ComponentProps } from 'react'

export const IconButton = ({
	className,
	...props
}: ComponentProps<'button'>) => {
	return (
		<button
			type='button'
			className={cn(
				'rounded-sm p-1.25 text-typography-600 hover:bg-surface-200 dark:hover:bg-surface-300',
				className,
			)}
			{...props}
		/>
	)
}
