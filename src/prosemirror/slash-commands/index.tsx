import { Autocomplete } from '@base-ui/react'
import { slashFactory } from '@milkdown/kit/plugin/slash'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import type { SlashCommand } from './default-commands'
import { useCommands } from './use-commands'
import { useSlashProvider } from './use-slash-provider'

export const slash = slashFactory('slash-commands')

export const SlashCommands = () => {
	const [open, setOpen] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)
	const listRef = useRef<HTMLDivElement>(null)
	const { value, view } = useSlashProvider({
		contentRef: listRef,
		onOpenChange: setOpen,
	})
	const { commands, runCommand } = useCommands()

	useEffect(() => {
		const input = inputRef.current
		if (!input) {
			return
		}

		const listener = (e: KeyboardEvent) => {
			if (!open || !view.dom.contains(e.target as Node)) {
				return
			}

			if (['ArrowUp', 'ArrowDown', 'Enter', 'Escape'].includes(e.key)) {
				e.preventDefault()
				input.dispatchEvent(
					new KeyboardEvent('keydown', {
						key: e.key,
						code: e.code,
						bubbles: e.bubbles,
					}),
				)
			}
		}

		document.addEventListener('keydown', listener)

		return () => document.removeEventListener('keydown', listener)
	}, [view, open])

	const handleKeyDown = (command: SlashCommand, e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			runCommand(command, e)
		}
	}

	return (
		<Autocomplete.Root
			inline
			open={open}
			items={commands}
			value={value}
			autoHighlight='always'
		>
			<Autocomplete.Input className='sr-only' ref={inputRef} />
			<Autocomplete.List
				ref={listRef}
				className="absolute h-fit max-h-96 min-w-52 overflow-y-auto overscroll-contain rounded-sm border border-border bg-surface-100 p-1 data-[empty]:hidden data-[show='false']:hidden"
			>
				{(command: SlashCommand) => (
					<Autocomplete.Item
						key={command.value}
						value={command}
						onClick={(e) => runCommand(command, e)}
						onKeyDown={(e) => {
							handleKeyDown(command, e)
						}}
						className='px-4 py-1.5 text-sm hover:bg-surface-300 data-highlighted:bg-surface-300'
					>
						{command.label}
					</Autocomplete.Item>
				)}
			</Autocomplete.List>
		</Autocomplete.Root>
	)
}
