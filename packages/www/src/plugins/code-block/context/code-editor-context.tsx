import type { EditorView as CodeMirror } from 'codemirror'
import { createContext, type PropsWithChildren, useContext } from 'react'
import { useObservable } from '../hooks/use-observable'
import type { LanguageRecord } from '../lib/language-collection'
import type { Observable } from '../lib/observable'

type CodeEditorState = {
	codeMirror: CodeMirror | null
	language: LanguageRecord | null
	languages: LanguageRecord[]
	setLanguage: (language: LanguageRecord) => void
}

const CodeEditorContext = createContext<CodeEditorState | null>(null)

type CodeEditorProviderProps = {
	codeMirror: Observable<CodeMirror | null>
	language: Observable<LanguageRecord | null>
	languages: LanguageRecord[]
} & PropsWithChildren

export const CodeEditorProvider = ({
	language: languageObservable,
	codeMirror: codeMirrorObservable,
	languages,
	children,
}: CodeEditorProviderProps) => {
	const language = useObservable(languageObservable)
	const codeMirror = useObservable(codeMirrorObservable)
	const setLanguage = (language: LanguageRecord) =>
		languageObservable.set(language)

	return (
		<CodeEditorContext.Provider
			value={{ language, codeMirror, languages, setLanguage }}
		>
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
