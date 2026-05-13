import type { EditorView as CodeMirror } from '@codemirror/view'
import { useEffect, useRef } from 'react'
import type { LanguageRecord } from '../lib/language-collection'
import { LanguageSelector } from './language-selector'
import type { Atom } from '@xstate/store'
import './code-mirror.css'

type CodeEditorProps = {
	codeMirror: CodeMirror
	language: Atom<LanguageRecord | null>
	languages: LanguageRecord[]
	onLanguageChange: (value: LanguageRecord) => void
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
