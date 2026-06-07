import type { EditorView as CodeMirror } from 'codemirror'
import { createContext, type PropsWithChildren, useContext } from 'react'
import type { CodeMirrorBridge } from '../lib/code-mirror-bridge'
import type { LanguageRepository } from '../lib/language-repository'

type CodeEditorState = {
	codeMirror: CodeMirror
	languageRepository: LanguageRepository
	bridge: CodeMirrorBridge
}

const CodeEditorContext = createContext<CodeEditorState | null>(null)

type CodeEditorProviderProps = CodeEditorState & PropsWithChildren

export const CodeEditorProvider = ({
	children,
	...state
}: CodeEditorProviderProps) => {
	return (
		<CodeEditorContext.Provider value={state}>
			{children}
		</CodeEditorContext.Provider>
	)
}

export const useCodeEditor = () => {
	const context = useContext(CodeEditorContext)

	if (context === null) {
		throw new Error(
			'CodeEditorContext is null. Make sure the component is wrapped in a CodeEditorProvider.',
		)
	}

	return context
}
