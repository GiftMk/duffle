import { SlashProvider } from '@milkdown/kit/plugin/slash'
import { type Selection, TextSelection } from '@milkdown/prose/state'
import type { EditorView } from '@milkdown/prose/view'
import { useInstance } from '@milkdown/react'
import { usePluginViewContext } from '@prosemirror-adapter/react'
import { useCallback, useEffect, useRef, useState } from 'react'

const isInCodeBlock = (selection: Selection) =>
	selection.$from.parent.type.name === 'code_block'

const isInList = (selection: Selection) =>
	selection.$from.node(selection.$from.depth - 1)?.type.name === 'list_item'

const isSelectionAtEndOfNode = (selection: Selection) => {
	if (!(selection instanceof TextSelection)) {
		return false
	}

	const { $head } = selection
	return $head.parentOffset === $head.parent.content.size
}

export const useSlashProvider = () => {
	const { view, prevState } = usePluginViewContext()
	const [loading] = useInstance()
	const [value, setValue] = useState('')
	const [open, setOpen] = useState(false)
	const [container, setContainer] = useState<HTMLDivElement | null>(null)
	const providerRef = useRef<SlashProvider | null>(null)

	useEffect(() => {
		if (loading) {
			return
		}

		const content = document.createElement('div')
		content.dataset.show = 'false'
		content.className = "absolute z-10 data-[show='false']:hidden"

		const slashProvider = new SlashProvider({
			content,
			debounce: 20,
			offset: 10,
			shouldShow(this: SlashProvider, currentView: EditorView) {
				const { selection } = currentView.state

				if (isInCodeBlock(selection) || isInList(selection)) {
					return false
				}

				if (!isSelectionAtEndOfNode(selection)) {
					return false
				}

				const currentText = this.getContent(currentView, (node) =>
					['paragraph', 'heading'].includes(node.type.name),
				)

				if (!currentText) {
					return false
				}

				setValue(
					currentText.startsWith('/') ? currentText.slice(1) : currentText,
				)

				return currentText.startsWith('/')
			},
		})
		slashProvider.onShow = () => setOpen(true)
		slashProvider.onHide = () => setOpen(false)
		providerRef.current = slashProvider
		setContainer(content)

		return () => {
			slashProvider.destroy()
			providerRef.current = null
			content.remove()
		}
	}, [loading])

	// `container` is set in the same effect that creates the provider, so
	// depending on it guarantees the provider gets an initial update
	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional
	useEffect(() => {
		providerRef.current?.update(view, prevState)
	}, [view, prevState, container])

	useEffect(() => {
		const reposition = () => providerRef.current?.update(view)

		window.addEventListener('resize', reposition)

		const observer = new ResizeObserver(reposition)
		observer.observe(view.dom)

		return () => {
			window.removeEventListener('resize', reposition)
			observer.disconnect()
		}
	}, [view])

	const hide = useCallback(() => providerRef.current?.hide(), [])

	return { container, value, open, hide, view }
}
