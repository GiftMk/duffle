import type { EditorView as CodeMirror } from '@codemirror/view'
import { useEffect, useRef } from 'react'
import type { LanguageMeta } from './language-collection'
import { LanguageSelector } from './language-selector'
import type { Observable } from './observable'

type CodeEditorProps = {
	codeMirror: CodeMirror
	language: Observable<LanguageMeta | null>
	languages: LanguageMeta[]
	onLanguageChange: (value: LanguageMeta) => void
}

export const CodeEditor = ({
	codeMirror,
	language,
	languages,
	onLanguageChange,
}: CodeEditorProps) => {
	const ref = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		const current = ref.current

		if (!current) {
			return
		}

		current.appendChild(codeMirror.dom)
	}, [codeMirror.dom])

	return (
		<div>
			<LanguageSelector
				language={language}
				languages={languages}
				onChange={onLanguageChange}
			/>
			<div ref={ref} />
		</div>
	)
}
