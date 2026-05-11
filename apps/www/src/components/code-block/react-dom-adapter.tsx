import { createRoot } from 'react-dom/client'
import { CodeEditor } from './code-editor'
import type { CodeMirrorBridge } from './code-mirror-bridge'
import type { LanguageCollection } from './language-collection'
import type { LazyCodeMirror } from './lazy-code-mirror'

type ReactDomAdapterParams = {
	codeMirror: LazyCodeMirror
	languages: LanguageCollection
	bridge: CodeMirrorBridge
}

export class ReactDomAdapter {
	readonly root: HTMLElement
	readonly render: () => void

	constructor({ codeMirror, languages, bridge }: ReactDomAdapterParams) {
		this.root = document.createElement('div')
		this.render = () => {
			createRoot(this.root).render(
				<CodeEditor
					codeMirror={codeMirror.value}
					onLanguageChange={(value) => bridge.pushLanguage(value)}
					languages={languages.values}
					language={bridge.language}
				/>,
			)
		}
	}
}
