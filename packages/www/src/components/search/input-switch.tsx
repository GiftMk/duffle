import { ChatIcon, MagnifyingGlassIcon } from '@phosphor-icons/react'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export type InputSwitchMode = 'search' | 'ask'

type InputSwitchProps = {
	mode: InputSwitchMode
	setMode: (mode: InputSwitchMode) => void
}

export const InputSwitch = ({ mode, setMode }: InputSwitchProps) => {
	return (
		<div className='flex gap-0.5 rounded-full border border-surface-400 bg-surface-200 p-1'>
			<SwitchButton
				active={mode === 'search'}
				onClick={() => setMode('search')}
			>
				<MagnifyingGlassIcon weight={mode === 'search' ? 'bold' : 'regular'} />
			</SwitchButton>
			<SwitchButton active={mode === 'ask'} onClick={() => setMode('ask')}>
				<ChatIcon weight={mode === 'ask' ? 'bold' : 'regular'} />
			</SwitchButton>
		</div>
	)
}

type SwitchButtonProps = {
	active?: boolean
} & ComponentProps<'button'>

const SwitchButton = ({
	active = false,
	className,
	...props
}: SwitchButtonProps) => {
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
