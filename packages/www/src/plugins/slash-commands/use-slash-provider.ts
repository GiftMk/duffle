import { SlashProvider } from '@milkdown/kit/plugin/slash'
import type { EditorState } from '@milkdown/prose/state'
import type { EditorView } from '@milkdown/prose/view'
import { useInstance } from '@milkdown/react'
import { usePluginViewContext } from '@prosemirror-adapter/react'
import { type RefObject, useEffect, useState } from 'react'

type UseSlashProviderProps<T extends HTMLElement> = {
	contentRef: RefObject<T | null>
	onOpenChange: (open: boolean) => void
}

const selectionHasChanged = (
	view: EditorView,
	prevState: EditorState | undefined,
) => {
	return !prevState?.selection?.eq(view.state.selection)
}

const findInputNode = (view: EditorView): HTMLElement | undefined => {
	const { node } = view.domAtPos(view.state.selection.anchor)
	if (node instanceof HTMLElement) {
		return node
	}
}

export const useSlashProvider = <T extends HTMLElement>({
	contentRef,
	onOpenChange,
}: UseSlashProviderProps<T>) => {
	const { view, prevState } = usePluginViewContext()
	const [value, setValue] = useState('')
	const [node, setNode] = useState<HTMLElement | null>(null)
	const [slashProvider, setSlashProvider] = useState<SlashProvider | null>(null)
	const [loading] = useInstance()

	useEffect(() => {
		const content = contentRef.current

		if (loading || !content) {
			return
		}

		const slashProvider = new SlashProvider({
			content,
			debounce: 0,
			shouldShow(this: SlashProvider, view, prevState) {
				const currentText = this.getContent(view, (node) =>
					['paragraph', 'heading'].includes(node.type.name),
				)

				if (!currentText) {
					return false
				}

				if (selectionHasChanged(view, prevState)) {
					const node = findInputNode(view)
					setNode(node ?? null)
				}

				if (currentText.startsWith('/')) {
					setValue(currentText.slice(1))
				} else {
					setValue(currentText)
				}

				return currentText.startsWith('/')
			},
		})
		slashProvider.onHide = () => onOpenChange(false)
		slashProvider.onShow = () => onOpenChange(true)
		setSlashProvider(slashProvider)

		return () => slashProvider.destroy()
	}, [loading, onOpenChange, contentRef])

	useEffect(
		() => slashProvider?.update(view, prevState),
		[view, prevState, slashProvider],
	)

	return { value, node }
}
