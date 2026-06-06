import type { EditorView as CodeMirror } from 'codemirror'
import { createRoot } from 'react-dom/client'
import type { CodeMirrorBridge } from '../lib/code-mirror-bridge'
import type {
	LanguageCollection,
	LanguageRecord,
} from '../lib/language-collection'
import type { Observable } from '../lib/observable'
import { CodeEditorProvider } from '../state/code-editor-context'
import { CodeEditor } from './code-editor'

type ReactDomAdapterParams = {
	codeMirror: Observable<CodeMirror | null>
	language: Observable<LanguageRecord | null>
	languages: LanguageCollection
	bridge: CodeMirrorBridge
}

export class ReactDomAdapter {
	readonly root: HTMLElement
	readonly render: () => void

	constructor({ codeMirror, language, languages }: ReactDomAdapterParams) {
		this.root = document.createElement('div')
		this.render = () => {
			createRoot(this.root).render(
				<CodeEditorProvider
					language={language}
					languages={languages.values}
					codeMirror={codeMirror}
				>
					<CodeEditor />
				</CodeEditorProvider>,
			)
		}
	}
}
