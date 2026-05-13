import { defaultKeymap, indentWithTab } from '@codemirror/commands'
import type { Line, SelectionRange } from '@codemirror/state'
import { keymap as codeMirrorKeymap } from '@codemirror/view'
import { exitCode } from '@milkdown/prose/commands'
import { redo, undo } from '@milkdown/prose/history'
import type { Node } from '@milkdown/prose/model'
import { TextSelection } from '@milkdown/prose/state'
import type { EditorView } from '@milkdown/prose/view'
import type { LazyCodeMirror } from './lazy-code-mirror'

type KeymapExtensionParams = {
	view: EditorView
	node: Node
	codeMirror: LazyCodeMirror
	getPosition: () => number | undefined
}

export class KeymapExtension {
	private readonly view: EditorView
	private readonly node: Node
	private readonly codeMirror: LazyCodeMirror
	private readonly getPosition: () => number | undefined

	constructor({ view, node, codeMirror, getPosition }: KeymapExtensionParams) {
		this.view = view
		this.node = node
		this.codeMirror = codeMirror
		this.getPosition = getPosition
	}

	get extension() {
		return codeMirrorKeymap.of([
			...this.customKeymap(),
			...defaultKeymap,
			indentWithTab,
		])
	}

	customKeymap() {
		return [
			{ key: 'ArrowUp', run: () => this.maybeEscape('line', -1) },
			{ key: 'ArrowLeft', run: () => this.maybeEscape('char', -1) },
			{ key: 'ArrowDown', run: () => this.maybeEscape('line', 1) },
			{ key: 'ArrowRight', run: () => this.maybeEscape('char', 1) },
			{
				key: 'Mod-Enter',
				run: () => {
					if (!exitCode(this.view.state, this.view.dispatch)) {
						return false
					}

					this.view.focus()
					return true
				},
			},
			{
				key: 'Mod-z',
				run: () => undo(this.view.state, this.view.dispatch),
			},
			{
				key: 'Shift-Mod-z',
				run: () => redo(this.view.state, this.view.dispatch),
			},
			{
				key: 'Mod-y',
				run: () => redo(this.view.state, this.view.dispatch),
			},
			{
				key: 'Backspace',
				run: () => {
					const codeMirror = this.codeMirror.value
					const ranges = codeMirror.state.selection.ranges

					if (ranges.length > 1) {
						return false
					}

					const selection = ranges[0]

					if (selection && (!selection.empty || selection.anchor > 0)) {
						return false
					}

					if (codeMirror.state.doc.lines >= 2) {
						return false
					}

					const state = this.view.state
					const position = this.getPosition() ?? 0
					const transaction = state.tr.replaceWith(
						position,
						position + this.node.nodeSize,
						state.schema.nodes.paragraph.createChecked({}, this.node.content),
					)

					transaction.setSelection(
						TextSelection.near(transaction.doc.resolve(position)),
					)

					this.view.dispatch(transaction)
					this.view.focus()
					return true
				},
			},
		]
	}

	maybeEscape(unit: 'line' | 'char', direction: 1 | -1): boolean {
		const { state } = this.codeMirror.value

		let main: SelectionRange | Line = state.selection.main

		if (!main.empty) {
			return false
		}

		if (unit === 'line') {
			main = state.doc.lineAt(main.head)
		}

		const outOfBounds =
			(direction < 0 && main.from > 0) ||
			(direction >= 0 && main.to < state.doc.length)

		if (outOfBounds) {
			return false
		}

		const targetPosition =
			this.getPosition() ?? 0 + (direction < 0 ? 0 : this.node.nodeSize)
		const selection = TextSelection.near(
			this.view.state.doc.resolve(targetPosition),
			direction,
		)
		const transaction = this.view.state.tr
			.setSelection(selection)
			.scrollIntoView()
		this.view.dispatch(transaction)
		this.view.focus()
		return true
	}
}
