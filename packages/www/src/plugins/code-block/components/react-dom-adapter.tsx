import type { EditorView as CodeMirror } from 'codemirror'
import { createRoot } from 'react-dom/client'
import { CodeEditorProvider } from '../context/code-editor-context'
import type { CodeMirrorBridge } from '../lib/code-mirror-bridge'
import type { LanguageRepository } from '../lib/language-repository'
import { CodeEditor } from './code-editor'
import type { Atom } from '@tanstack/react-store'

type ReactDomAdapterParams = {
	codeMirrorAtom: Atom<CodeMirror | null>
	languageRepository: LanguageRepository
	bridge: CodeMirrorBridge
}

export class ReactDomAdapter {
	readonly root: HTMLElement = document.createElement('div')
	readonly render: () => void

	constructor(props: ReactDomAdapterParams) {
		this.render = () => {
			createRoot(this.root).render(
				<CodeEditorProvider {...props}>
					<CodeEditor />
				</CodeEditorProvider>,
			)
		}
	}
}
