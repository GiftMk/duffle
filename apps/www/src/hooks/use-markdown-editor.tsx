import {
	defaultValueCtx,
	Editor,
	editorViewCtx,
	editorViewOptionsCtx,
	rootCtx,
} from '@milkdown/kit/core'
import type { Ctx } from '@milkdown/kit/ctx'
import { listener, listenerCtx } from '@milkdown/kit/plugin/listener'
import { commonmark } from '@milkdown/kit/preset/commonmark'
import { useEditor } from '@milkdown/react'
import { useEffect } from 'react'

type MarkdownEditorOptions = Partial<{
	onPaste: (editor: Editor, e: ClipboardEvent) => void
	onUpdate: (markdown: string) => void
}>

export const useMarkdownEditor = (
	content: string,
	options?: MarkdownEditorOptions,
) => {
	const { get } = useEditor((root) =>
		Editor.make()
			.use(listener)
			.config((ctx) => {
				ctx.set(rootCtx, root)
				ctx.set(defaultValueCtx, content)
				ctx.update(editorViewOptionsCtx, (prev) => ({
					...prev,
					attributes: { autofocus: 'true' },
				}))
			})
			.use(commonmark),
	)

	useEffect(() => {
		const editor = get()

		if (!editor) {
			return
		}

		const view = editor.ctx.get(editorViewCtx)
		const handlePaste = (e: ClipboardEvent) => options.onPaste(editor, e)
		view.dom.addEventListener('paste', handlePaste, true)

		const listenerManager = editor.ctx.get(listenerCtx)
		const handleUpdate = (_: Ctx, markdown: string) =>
			options.onUpdate(markdown)
		listenerManager.markdownUpdated(handleUpdate)

		return () => view.dom.removeEventListener('paste', handlePaste)
	}, [get, options.onPaste, options.onUpdate])

	return { ref: get }
}
