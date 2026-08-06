import type { Node } from '@milkdown/prose/model'
import type { EditorView } from '@milkdown/prose/view'
import type { EditorView as CodeMirror } from 'codemirror'
import { createRoot } from 'react-dom/client'
import type { CodeMirrorBridge } from '../code-mirror-bridge'
import { CodeEditorProvider } from '../hooks/use-code-editor'
import type { LanguageRepository } from '../language-repository'
import type { Reference } from '../reference'
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
