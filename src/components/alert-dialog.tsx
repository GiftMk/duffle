import { AlertDialog } from '@base-ui/react'
import { XIcon } from '@phosphor-icons/react'
import type { ComponentProps } from 'react'
import { IconButton } from '@/components/icon-button'
import { ICON_SIZE_MD } from '@/lib/constants'
import { cn } from '@/lib/utils'

export const AlertDialogRoot = AlertDialog.Root

type AlertDialogTriggerProps = ComponentProps<typeof AlertDialog.Trigger>

export const AlertDialogTrigger = ({
	onClick,
	...props
}: AlertDialogTriggerProps) => {
	return <AlertDialog.Trigger onClick={onClick} {...props} />
}

type AlertDialogContentProps = ComponentProps<typeof AlertDialog.Popup>

export const AlertDialogContent = ({
	className,
	children,
	...props
}: AlertDialogContentProps) => {
	return (
		<AlertDialog.Portal>
			<AlertDialog.Backdrop className='fixed inset-0 bg-surface-950/20' />
			<AlertDialog.Popup
				className={cn(
					'fixed top-1/2 left-1/2 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-md border border-surface-400 bg-surface-100 py-6 shadow-2xl shadow-surface-400/50 focus:outline-none',
					className,
				)}
				{...props}
			>
				<AlertDialog.Close
					render={
						<IconButton className='absolute top-4 right-4'>
							<XIcon size={ICON_SIZE_MD} />
						</IconButton>
					}
				/>
				{children}
			</AlertDialog.Popup>
		</AlertDialog.Portal>
	)
}

type AlertDialogTitleProps = ComponentProps<typeof AlertDialog.Title>

export const AlertDialogTitle = ({
	className,
	...props
}: AlertDialogTitleProps) => {
	return (
		<AlertDialog.Title
			className={cn(
				'px-6 font-semibold text-sm text-typography-950',
				className,
			)}
			{...props}
		/>
	)
}

type AlertDialogDescriptionProps = ComponentProps<
	typeof AlertDialog.Description
>

export const AlertDialogDescription = ({
	className,
	...props
}: AlertDialogDescriptionProps) => {
	return (
		<AlertDialog.Description
			className={cn('mt-2 px-6 text-sm text-typography-600', className)}
			{...props}
		/>
	)
}

export const AlertDialogActions = ({
	className,
	...props
}: ComponentProps<'div'>) => {
	return (
		<div
			className={cn('mt-6 flex justify-end gap-2 px-6', className)}
			{...props}
		/>
	)
}

type AlertDialogActionProps = ComponentProps<'button'> & {
	variant?: 'primary' | 'destructive'
}

export const AlertDialogAction = ({
	className,
	variant = 'primary',
	onClick,
	...props
}: AlertDialogActionProps) => {
	return (
		<AlertDialog.Close
			onClick={onClick}
			render={
				<button
					type='button'
					className={cn(
						'rounded-md px-3 py-2 text-sm text-surface-50 dark:text-typography-900',
						{
							'bg-red-600 hover:bg-red-700': variant === 'destructive',
							'bg-primary-600 hover:bg-primary-700': variant === 'primary',
						},
						className,
					)}
					{...props}
				/>
			}
		/>
	)
}

export const AlertDialogCancel = ({
	className,
	onClick,
	...props
}: ComponentProps<'button'>) => {
	return (
		<AlertDialog.Close
			onClick={onClick}
			render={
				<button
					type='button'
					className={cn(
						'rounded-md px-3 py-2 text-sm text-typography-600 hover:bg-surface-300/50',
						className,
					)}
					{...props}
				/>
			}
		/>
	)
}
