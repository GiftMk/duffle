import { editorViewCtx } from '@milkdown/kit/core'
import { Ctx } from '@milkdown/kit/ctx'
import { slashFactory, SlashProvider } from '@milkdown/kit/plugin/slash'
import { createCodeBlockCommand } from '@milkdown/kit/preset/commonmark'
import { useInstance } from '@milkdown/react'
import { callCommand } from '@milkdown/kit/utils'
import { usePluginViewContext } from '@prosemirror-adapter/react'
import React, { useEffect, useRef, useState, type RefObject } from 'react'
import { cn } from '@/lib/utils'

export const slash = slashFactory('slash-commands')

export const SlashCommands = () => {
	const ref = useRef<HTMLUListElement>(null)
	const slashProvider = useRef<SlashProvider>(null)

	const { view, prevState } = usePluginViewContext()
	const [loading, get] = useInstance()
	const [open, setOpen] = useState(false)
	const [itemRefs, setItemRefs] = useState<RefObject<HTMLLIElement>[]>([])
	const [activeItemIndex, setActiveItemIndex] = useState<number | undefined>()

	const action = (fn: (ctx: Ctx) => void) => {
		if (loading) return
		get().action(fn)
	}

	useEffect(() => {
		const div = ref.current

		if (loading || !div) {
			return
		}

		slashProvider.current = new SlashProvider({
			content: div,
		})
		slashProvider.current.onHide = () => setOpen(false)
		slashProvider.current.onShow = () => setOpen(true)

		return () => {
			slashProvider.current?.destroy()
		}
	}, [loading])

	useEffect(() => {
		const listener = (e: KeyboardEvent) => {
			if (e.key === 'ArrowDown') {
				setActiveItemIndex(0)
			} else {
				setActiveItemIndex(undefined)
			}
		}
		const cleanup = () => document.removeEventListener('keydown', listener)

		if (open) {
			document.addEventListener('keydown', listener)
		} else {
			cleanup()
		}

		return cleanup
	}, [open])

	useEffect(() => {
		slashProvider.current?.update(view, prevState)
	}, [view, prevState])

	const command = (e: React.KeyboardEvent | React.MouseEvent) => {
		e.preventDefault()
		action((ctx) => {
			slashProvider.current?.getContent

			const view = ctx.get(editorViewCtx)

			const { dispatch, state } = view
			const { tr, selection } = state
			const { from } = selection
			dispatch(tr.deleteRange(from - 1, from))
			view.focus()
			return callCommand(createCodeBlockCommand.key)(ctx)
		})
	}

	const registerListItem = (element: HTMLLIElement | null) => {
		if (element) {
			itemRefs.push({ current: element })
		}
	}

	return (
		<ul
			ref={ref}
			className="absolute data-[show='false']:hidden rounded-sm border border-border bg-surface-100 max-h-96 min-h-42 min-w-52 overflow-y-auto overscroll-contain rounded-sm p-1"
		>
			<li
				ref={registerListItem}
				onClick={command}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						command(e)
					}
				}}
				className={cn('px-4 py-1.5 text-sm hover:bg-surface-300', {
					'bg-surface-300': activeItemIndex === 0,
				})}
			>
				Code Block
			</li>
		</ul>
	)
}
