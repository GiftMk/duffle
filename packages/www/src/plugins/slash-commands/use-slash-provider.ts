import { SlashProvider } from '@milkdown/kit/plugin/slash'
import type { EditorState, Selection } from '@milkdown/prose/state'
import type { EditorView } from '@milkdown/prose/view'
import { useInstance } from '@milkdown/react'
import { usePluginViewContext } from '@prosemirror-adapter/react'
import { type RefObject, useEffect, useState } from 'react'

type UseSlashProviderProps<T extends HTMLElement> = {
	contentRef: RefObject<T | null>
	onOpenChange: (open: boolean) => void
}

// const getSelectionContent = (selection: Selection) => {
//   return selection.$head.parent.textContent
// }

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

export function isInList(selection: Selection) {
	const type = selection.$from.node(selection.$from.depth - 1)?.type
	return type?.name === 'list_item'
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
			shouldShow(this: SlashProvider, view, prevState) {
				const currentText = this.getContent(view, (node) =>
					['paragraph', 'heading'].includes(node.type.name),
				)

				if (!currentText) {
					return false
				}

				if (selectionHasChanged(view, prevState)) {
					setNode(findInputNode(view) ?? null)
				}

				const trimmedText = currentText.startsWith('/')
					? currentText.slice(1)
					: currentText
				setValue(trimmedText)

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
