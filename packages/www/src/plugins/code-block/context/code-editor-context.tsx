import type { Atom } from '@tanstack/react-store'
import type { EditorView as CodeMirror } from 'codemirror'
import { createContext, type PropsWithChildren, useContext } from 'react'
import type {
	LanguageRecord,
	LanguageRepository,
} from '../lib/language-repository'
import type { CodeMirrorBridge } from '../lib/code-mirror-bridge'

type CodeEditorState = {
	codeMirrorAtom: Atom<CodeMirror | null>
	languageAtom: Atom<LanguageRecord | null>
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
