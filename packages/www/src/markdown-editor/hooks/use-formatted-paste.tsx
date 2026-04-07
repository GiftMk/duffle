import { type Editor, editorViewCtx, parserCtx } from '@milkdown/kit/core'
import { useEffect } from 'react'

const onPaste = (editor: Editor, e: ClipboardEvent) => {
	const text = e.clipboardData?.getData('text/plain')
	if (!text) {
		return
	}

	e.preventDefault()
	e.stopPropagation()

	editor.action((ctx) => {
		const parser = ctx.get(parserCtx)
		const view = ctx.get(editorViewCtx)
		const doc = parser(text)
		const { state, dispatch } = view
		const tr = state.tr.replaceSelectionWith(doc)
		dispatch(tr)
	})
}

export const useFormattedPaste = (ref: () => Editor) => {
	useEffect(() => {
		const editor = ref()
		if (!editor) {
			return
		}

		const handlePaste = (e: ClipboardEvent) => onPaste(editor, e)
		const view = editor.ctx.get(editorViewCtx)
		view.dom.addEventListener('paste', handlePaste, true)

		return () => view.dom.removeEventListener('paste', handlePaste, true)
	}, [ref])
}
