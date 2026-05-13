import { createRoot } from 'react-dom/client'
import { CodeEditor } from './code-block'
import type { CodeMirrorBridge } from '../lib/code-mirror-bridge'
import type {
	LanguageCollection,
	LanguageRecord,
} from '../lib/language-collection'
import type { LazyCodeMirror } from '../lib/lazy-code-mirror'
import type { Atom } from '@xstate/store'

type ReactDomAdapterParams = {
	codeMirror: LazyCodeMirror
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
					codeMirror={codeMirror.value}
					onLanguageChange={(value) => bridge.pushLanguage(value)}
					languages={languages.values}
					language={language}
				/>,
			)
		}
	}
}
