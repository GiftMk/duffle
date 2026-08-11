import type { Extension } from '@codemirror/state'
import { EditorView as CodeMirror } from '@codemirror/view'
import type { Node } from '@milkdown/prose/model'
import type { EditorView, NodeView } from '@milkdown/prose/view'
import type { CodeMirrorBridge } from './code-mirror-bridge'
import type { Reference } from './reference'

export type CodeBlockViewParams = {
	node: Reference<Node>
	view: EditorView
	bridge: CodeMirrorBridge
	dom: HTMLElement
	extensions?: Extension
}

export class CodeBlockView implements NodeView {
	readonly codeMirror: CodeMirror
	private bridge: CodeMirrorBridge
	readonly dom: HTMLElement

	constructor({
		node,
		view,
		bridge,
		dom,
		extensions = [],
	}: CodeBlockViewParams) {
		this.bridge = bridge
		this.codeMirror = new CodeMirror({
			doc: node.value.textContent,
			root: view.root,
			extensions: [extensions, this.bridge.extensions],
		})
		this.dom = dom
	}

	setSelection(anchor: number, head: number) {
		this.bridge.readSelection(anchor, head)
	}

	update(node: Node): boolean {
		return this.bridge.readContent(node)
	}

	selectNode() {
		this.codeMirror.focus()
	}

	stopEvent() {
		return true
	}
}
