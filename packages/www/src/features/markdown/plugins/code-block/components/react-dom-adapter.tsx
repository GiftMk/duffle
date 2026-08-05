import type { Node } from '@milkdown/prose/model'
import type { EditorView } from '@milkdown/prose/view'
import type { EditorView as CodeMirror } from 'codemirror'
import { createRoot } from 'react-dom/client'
import { CodeEditorProvider } from '../hooks/use-code-editor'
import type { CodeMirrorBridge } from '../lib/code-mirror-bridge'
import type { LanguageRepository } from '../lib/language-repository'
import type { Reference } from '../lib/reference'
import { CodeEditor } from './code-editor'

type ReactDomAdapterParams = {
	codeMirror: Reference<CodeMirror | null>
	languageInput: Reference<HTMLInputElement | null>
	languageRepository: LanguageRepository
	bridge: CodeMirrorBridge
	node: Reference<Node>
	view: EditorView
	getPos: () => number | undefined
}

export class ReactDomAdapter {
	readonly root: HTMLElement = document.createElement('div')
	readonly render: () => void

	constructor({ ...props }: ReactDomAdapterParams) {
		this.render = () => {
			createRoot(this.root).render(
				<CodeEditorProvider {...props}>
					<CodeEditor />
				</CodeEditorProvider>,
			)
		}
	}
}
