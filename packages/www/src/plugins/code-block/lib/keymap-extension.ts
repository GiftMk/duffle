import { defaultKeymap, indentWithTab } from '@codemirror/commands'
import type { Line, SelectionRange } from '@codemirror/state'
import { keymap as codeMirrorKeymap } from '@codemirror/view'
import { exitCode } from '@milkdown/prose/commands'
import { redo, undo } from '@milkdown/prose/history'
import type { Node } from '@milkdown/prose/model'
import { TextSelection } from '@milkdown/prose/state'
import type { EditorView } from '@milkdown/prose/view'
import type { EditorView as CodeMirror } from 'codemirror'
import type { Lazy } from './lazy'

type KeymapExtensionParams = {
	view: EditorView
	node: Node
	getPos: () => number | undefined
	codeMirror: Lazy<CodeMirror>
	languageInput: Lazy<HTMLInputElement>
}

export class KeymapExtension {
	private readonly view: EditorView
	private readonly node: Node
	private readonly getPos: () => number | undefined
	private readonly codeMirror: Lazy<CodeMirror>
	private readonly languageInput: Lazy<HTMLInputElement>

	constructor({
		view,
		node,
		getPos,
		codeMirror,
		languageInput,
	}: KeymapExtensionParams) {
		this.view = view
		this.node = node
		this.getPos = getPos
		this.codeMirror = codeMirror
		this.languageInput = languageInput
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
			{
				key: 'ArrowUp',
				run: () => {
					if (this.languageInput.hasValue) {
						this.languageInput.value.focus()
						return true
					}

					return this.maybeEscape('line', -1)
				},
			},
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
					if (!this.codeMirror.hasValue) {
						return false
					}

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
					const position = this.getPos() ?? 0
					const node = state.schema.nodes.paragraph?.createChecked()

					if (!node) {
						return false
					}

					const transaction = state.tr.replaceWith(position, position + 1, node)
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
		if (!this.codeMirror.hasValue) {
			return false
		}

		const { state } = this.codeMirror.value
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

		const nodeSize = direction < 0 ? 0 : this.node.nodeSize
		const targetPosition = (this.getPos() ?? 0) + nodeSize
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
