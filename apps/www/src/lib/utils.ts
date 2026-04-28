import { type Editor, editorViewCtx, parserCtx } from '@milkdown/kit/core'

export const formatOnPaste = (editor: Editor, e: ClipboardEvent) => {
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
