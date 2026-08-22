import type { Line, SelectionRange } from '@codemirror/state'
import type { Node } from '@milkdown/prose/model'
import { TextSelection } from '@milkdown/prose/state'
import type { EditorView } from '@milkdown/prose/view'
import type { EditorView as CodeMirror } from 'codemirror'

type EscapeCodeMirrorState = {
	view: EditorView
	codeMirror: CodeMirror
	node: Node
	getPos: () => number | undefined
}

export const escapeCodeMirror = (
	unit: 'line' | 'char',
	direction: 1 | -1,
	{ codeMirror, view, node, getPos }: EscapeCodeMirrorState,
): boolean => {
	if (!codeMirror) {
		return false
	}

	const { state } = codeMirror
	let main: SelectionRange | Line = state.selection.main

	if (!main.empty) {
		return false
	}

	if (unit === 'line') {
		main = state.doc.lineAt(main.head)
	}

	if (direction < 0 ? main.from > 0 : main.to < state.doc.length) {
		return false
	}

	const nodeSize = direction < 0 ? 0 : node.nodeSize
	const targetPosition = (getPos() ?? 0) + nodeSize
	const selection = TextSelection.near(
		view.state.doc.resolve(targetPosition),
		direction,
	)
	const transaction = view.state.tr.setSelection(selection).scrollIntoView()
	view.dispatch(transaction)
	view.focus()
	return true
}
