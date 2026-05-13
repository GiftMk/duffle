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
	codeMirrorAtom: Atom<CodeMirror | null>
	languageAtom: Atom<LanguageRecord | null>
	languages: LanguageCollection
	bridge: CodeMirrorBridge
}

export class ReactDomAdapter {
	readonly root: HTMLElement
	readonly render: () => void

	constructor({
		codeMirrorAtom,
		languageAtom,
		languages,
		bridge,
	}: ReactDomAdapterParams) {
		this.root = document.createElement('div')
		this.render = () => {
			createRoot(this.root).render(
				<CodeEditor
					codeMirrorAtom={codeMirrorAtom}
					onLanguageChange={(value) => bridge.writeLanguage(value)}
					languages={languages.values}
					languageAtom={languageAtom}
				/>,
			)
		}
	}
}
