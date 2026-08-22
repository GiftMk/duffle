import { SlashProvider } from '@milkdown/kit/plugin/slash'
import type { EditorView } from '@milkdown/prose/view'
import { useInstance } from '@milkdown/react'
import { usePluginViewContext } from '@prosemirror-adapter/react'
import { type RefObject, useEffect, useState } from 'react'

type UseSlashProviderProps<T extends HTMLElement> = {
	contentRef: RefObject<T | null>
	onOpenChange: (open: boolean) => void
}

export const useSlashProvider = <T extends HTMLElement>({
	contentRef,
	onOpenChange,
}: UseSlashProviderProps<T>) => {
	const { view, prevState } = usePluginViewContext()
	const [value, setValue] = useState('')
	const [slashProvider, setSlashProvider] = useState<SlashProvider | null>(null)
	const [loading] = useInstance()

	useEffect(() => {
		const content = contentRef.current

		if (loading || !content) {
			return
		}

		const slashProvider = new SlashProvider({
			content,
			shouldShow(this: SlashProvider, view: EditorView) {
				const currentText = this.getContent(view, (node) =>
					['paragraph', 'heading'].includes(node.type.name),
				)

				if (!currentText) {
					return false
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

	return { value, view }
}
