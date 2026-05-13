import type { Atom } from '@xstate/store'
import type { EditorView as CodeMirror } from 'codemirror'
import { createRoot } from 'react-dom/client'
import type { CodeMirrorBridge } from '../lib/code-mirror-bridge'
import type {
	LanguageCollection,
	LanguageRecord,
} from '../lib/language-collection'
import { CodeEditor } from './code-block'

type ReactDomAdapterParams = {
	codeMirror: Atom<CodeMirror | null>
	language: Atom<LanguageRecord | null>
	languages: LanguageCollection
	bridge: CodeMirrorBridge
}

export class ReactDomAdapter {
	readonly root: HTMLElement
	readonly render: () => void

	constructor({
		codeMirror,
		language,
		languages,
		bridge,
	}: ReactDomAdapterParams) {
		this.root = document.createElement('div')
		this.render = () => {
			createRoot(this.root).render(
				<CodeEditor
					codeMirror={codeMirror}
					onLanguageChange={(value) => bridge.pushLanguage(value)}
					languages={languages.values}
					language={language}
				/>,
			)
		}
	}
}
