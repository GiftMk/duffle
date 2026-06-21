import { Input } from '@base-ui/react'
import { Dialog } from '@base-ui/react/dialog'
import { ChatIcon, MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr'
import { useHotkey } from '@tanstack/react-hotkeys'
import { type ComponentProps, useState } from 'react'
import { cn } from '@/lib/utils'

export const NotesDialog = () => {
	const [open, setOpen] = useState(false)

	useHotkey('Mod+K', () => setOpen(true))

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Trigger
				render={
					<button
						type='button'
						className='flex h-fit w-fit items-center justify-center rounded-full border border-surface-400 bg-surface-100 p-2 text-typography-600 hover:bg-surface-300/50 focus:outline-none'
					>
						<TelescopeIcon />
					</button>
				}
			/>
			<Dialog.Portal>
				<Dialog.Backdrop className='fixed inset-0 w-full bg-black/0 data-ending-style:opacity-0 data-starting-style:opacity-0' />
				<Dialog.Popup className='fixed top-50 left-1/2 w-2xl -translate-x-1/2 -translate-y-1/2 rounded-md border border-surface-400 bg-surface-100 p-4 shadow-2xl shadow-surface-400/50 focus:outline-none'>
					<span className='flex w-full items-center gap-3 p-2'>
						<InputSwitch />
						<Input
							autoFocus
							className='h-full w-full border-surface-400 border-b py-2 focus:outline-none'
						/>
					</span>
				</Dialog.Popup>
			</Dialog.Portal>
		</Dialog.Root>
	)
}

type InputSwitchModeProps = {
	active?: boolean
} & ComponentProps<'button'>

const InputSwitchMode = ({
	active = false,
	className,
	...props
}: InputSwitchModeProps) => {
	return (
		<button
			type='button'
			className={cn(
				'flex h-8 w-8 items-center justify-center rounded-full p-1 text-surface-600 hover:bg-surface-300 focus:outline-0',
				{ 'bg-primary-500 text-typography-100 hover:bg-primary-500': active },
				className,
			)}
			{...props}
		/>
	)
}

const InputSwitch = () => {
	const [mode, setMode] = useState<'search' | 'ask'>('search')

	return (
		<div className='flex gap-0.5 rounded-full border border-surface-400 bg-surface-200 p-1'>
			<InputSwitchMode
				active={mode === 'search'}
				onClick={() => setMode('search')}
			>
				<MagnifyingGlassIcon weight={mode === 'search' ? 'bold' : 'regular'} />
			</InputSwitchMode>
			<InputSwitchMode active={mode === 'ask'} onClick={() => setMode('ask')}>
				<ChatIcon weight={mode === 'ask' ? 'bold' : 'regular'} />
			</InputSwitchMode>
		</div>
	)
}

const TelescopeIcon = ({
	className,
	strokeWidth,
}: {
	className?: string
	strokeWidth?: string
}) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='20'
			height='20'
			fill='none'
			stroke='currentColor'
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth={strokeWidth ?? '1.25'}
			className={cn('lucide lucide-telescope-icon lucide-telescope', className)}
			viewBox='0 0 24 24'
		>
			<title>Telescope</title>
			<path d='m10.065 12.493-6.18 1.318a.934.934 0 0 1-1.108-.702l-.537-2.15a1.07 1.07 0 0 1 .691-1.265l13.504-4.44M13.56 11.747l4.332-.924M16 21l-3.105-6.21'></path>
			<path d='M16.485 5.94a2 2 0 0 1 1.455-2.425l1.09-.272a1 1 0 0 1 1.212.727l1.515 6.06a1 1 0 0 1-.727 1.213l-1.09.272a2 2 0 0 1-2.425-1.455zM6.158 8.633l1.114 4.456M8 21l3.105-6.21'></path>
			<circle cx='12' cy='13' r='2'></circle>
		</svg>
	)
}
