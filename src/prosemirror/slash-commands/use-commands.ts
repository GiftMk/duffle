import { editorViewCtx } from '@milkdown/kit/core'
import type { Ctx } from '@milkdown/kit/ctx'
import { useInstance } from '@milkdown/react'
import { DEFAULT_COMMANDS, type SlashCommand } from './default-commands'

export const useCommands = (commands: SlashCommand[] = DEFAULT_COMMANDS) => {
	const [loading, get] = useInstance()

	const action = (fn: (ctx: Ctx) => void) => {
		if (loading) return
		get().action(fn)
	}

	const runCommand = (
		command: SlashCommand,
		e: React.KeyboardEvent | React.MouseEvent,
	) => {
		e.preventDefault()
		action((ctx) => {
			const view = ctx.get(editorViewCtx)
			view.focus()
			command.run(ctx)
		})
	}

	return { commands, runCommand }
}
