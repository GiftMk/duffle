import { Autocomplete } from '@base-ui/react'
import { slashFactory } from '@milkdown/kit/plugin/slash'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { SlashCommand } from './default-commands'
import { useCommands } from './use-commands'
import { useSlashProvider } from './use-slash-provider'

export const slash = slashFactory('slash-commands')

const NAVIGATION_KEYS = ['ArrowUp', 'ArrowDown', 'Enter']

type SlashCommandItemProps = {
	command: SlashCommand
	onRun: (command: SlashCommand, e: React.MouseEvent) => void
}

const SlashCommandItem = ({ command, onRun }: SlashCommandItemProps) => {
	const handleClick = (e: React.MouseEvent) => {
		onRun(command, e)
	}

	return (
		<Autocomplete.Item
			value={command}
			onClick={handleClick}
			className='px-4 py-1.5 text-sm hover:bg-surface-300 data-highlighted:bg-surface-300'
		>
			{command.label}
		</Autocomplete.Item>
	)
}

export const SlashCommands = () => {
	const inputRef = useRef<HTMLInputElement>(null)
	const { container, open, value, hide, view } = useSlashProvider()
	const { commands, runCommand } = useCommands(value)

	useEffect(() => {
		if (open && commands.length === 0) {
			hide()
		}
	}, [open, commands.length, hide])

	useEffect(() => {
		const input = inputRef.current

		if (!open || !input) {
			return
		}

		const onKeyDown = (event: KeyboardEvent) => {
			if (!view.dom.contains(event.target as Node)) {
				return
			}

			if (event.metaKey || event.ctrlKey || event.altKey) {
				return
			}

			if (event.key === 'Escape') {
				event.preventDefault()
				hide()
				return
			}

			if (!NAVIGATION_KEYS.includes(event.key)) {
				return
			}

			event.preventDefault()
			input.dispatchEvent(
				new KeyboardEvent('keydown', {
					key: event.key,
					code: event.code,
					bubbles: true,
					cancelable: true,
				}),
			)
		}

		window.addEventListener('keydown', onKeyDown, { capture: true })

		return () =>
			window.removeEventListener('keydown', onKeyDown, { capture: true })
	}, [open, view, hide])

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen) {
			hide()
		}
	}

	if (!container) {
		return null
	}

	return createPortal(
		<Autocomplete.Root
			inline
			mode='none'
			open={open}
			onOpenChange={handleOpenChange}
			items={commands}
			value={value}
			autoHighlight='always'
		>
			<Autocomplete.Input className='sr-only' ref={inputRef} />
			<Autocomplete.List className='h-fit max-h-96 min-w-52 overflow-y-auto overscroll-contain rounded-sm border border-border bg-surface-100 p-1 data-[empty]:hidden'>
				{(command: SlashCommand) => (
					<SlashCommandItem
						key={command.value}
						command={command}
						onRun={runCommand}
					/>
				)}
			</Autocomplete.List>
		</Autocomplete.Root>,
		container,
	)
}
