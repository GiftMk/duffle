import { defaultKeymap, indentWithTab } from '@codemirror/commands'
import { keymap as codeMirrorKeymap } from '@codemirror/view'
import { exitCode } from '@milkdown/prose/commands'
import { redo, undo } from '@milkdown/prose/history'
import type { Node } from '@milkdown/prose/model'
import { TextSelection } from '@milkdown/prose/state'
import type { EditorView } from '@milkdown/prose/view'
import type { EditorView as CodeMirror } from 'codemirror'
import type { Reference } from './reference'
import { escapeCodeMirror } from './utils'

type KeymapExtensionParams = {
	view: EditorView
	node: Reference<Node>
	getPos: () => number | undefined
	codeMirror: Reference<CodeMirror | null>
	languageInput: Reference<HTMLInputElement | null>
}

export class KeymapExtension {
	private readonly view: EditorView
	private readonly node: Reference<Node>
	private readonly getPos: () => number | undefined
	private readonly codeMirror: Reference<CodeMirror | null>
	private readonly languageInput: Reference<HTMLInputElement | null>

	constructor({
		node,
		view,
		getPos,
		codeMirror,
		languageInput,
	}: KeymapExtensionParams) {
		this.node = node
		this.view = view
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
					if (!this.codeMirror.value) {
						return false
					}

					const codeMirror = this.codeMirror.value
					const selection = codeMirror.state.selection.ranges[0]
					const head = selection?.head
					const line = head ? codeMirror.state.doc.lineAt(head) : undefined
					const firstLineIsActive = head === 0 || line?.number === 1

					if (firstLineIsActive && this.languageInput.value) {
						this.languageInput.value.focus()
						return true
					}

					return this.escape('line', -1)
				},
			},
			{ key: 'ArrowLeft', run: () => this.escape('char', -1) },
			{
				key: 'ArrowDown',
				run: () => this.escape('line', 1),
			},
			{ key: 'ArrowRight', run: () => this.escape('char', 1) },
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
					if (!this.codeMirror.value) {
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
					const node = state.schema.nodes.paragraph?.createChecked(
						{},
						this.node.value.content,
					)

					if (!node) {
						return false
					}

					const transaction = state.tr.replaceWith(
						position,
						position + this.node.value.nodeSize,
						node,
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

	escape(unit: 'line' | 'char', direction: 1 | -1): boolean {
		if (!this.codeMirror.value) {
			return false
		}

		return escapeCodeMirror(unit, direction, {
			codeMirror: this.codeMirror.value,
			node: this.node.value,
			view: this.view,
			getPos: this.getPos,
		})
	}
}
