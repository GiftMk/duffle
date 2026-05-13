import type { Extension } from '@codemirror/state'
import { EditorView as CodeMirror } from '@codemirror/view'
import type { Node } from '@milkdown/prose/model'
import type { EditorView, NodeView } from '@milkdown/prose/view'
import type { CodeMirrorBridge } from './code-mirror-bridge'

export type CodeBlockViewParams = {
	node: Node
	view: EditorView
	getPosition: () => number | undefined
	bridge: CodeMirrorBridge
	dom: HTMLElement
	extensions?: Extension
}

export class CodeBlockView implements NodeView {
	readonly codeMirror: CodeMirror
	private node: Node
	private bridge: CodeMirrorBridge
	protected readonly view: EditorView
	protected readonly getPosition: () => number | undefined
	readonly dom: HTMLElement

	constructor({
		node,
		view,
		getPosition,
		bridge,
		dom,
		extensions = [],
	}: CodeBlockViewParams) {
		this.node = node
		this.view = view
		this.getPosition = getPosition
		this.bridge = bridge
		this.codeMirror = new CodeMirror({
			doc: this.node.textContent,
			root: this.view.root,
			extensions: [extensions, this.bridge.extensions],
		})
		this.dom = dom
	}

	setSelection(anchor: number, head: number) {
		this.bridge.readSelection(anchor, head)
	}

	update(node: Node): boolean {
		return this.bridge.readDocument(node)
	}

	selectNode() {
		this.codeMirror.focus()
	}

	stopEvent() {
		return true
	}
}
