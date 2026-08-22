import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

type IconButtonProps = ComponentProps<'button'> & {
	variant?: 'primary' | 'destructive'
}

export const IconButton = ({
	className,
	variant = 'primary',
	...props
}: IconButtonProps) => {
	return (
		<button
			type='button'
			className={cn(
				'rounded-sm p-1.25 text-typography-600 hover:bg-surface-200 dark:hover:bg-surface-300',
				{ 'hover:bg-red-600/10 hover:text-red-700': variant === 'destructive' },
				className,
			)}
			{...props}
		/>
	)
}
