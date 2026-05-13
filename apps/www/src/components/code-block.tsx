import type { EditorView as CodeMirror } from '@codemirror/view'
import type { Atom } from '@xstate/store'
import { useEffect, useRef } from 'react'
import type { LanguageRecord } from '../lib/language-collection'
import { LanguageSelector } from './language-selector'
import './code-mirror.css'
import { useAtom } from '@xstate/store-react'

type CodeEditorProps = {
	codeMirror: Atom<CodeMirror | null>
	language: Atom<LanguageRecord | null>
	languages: LanguageRecord[]
	onLanguageChange: (value: LanguageRecord) => void
}

export const CodeEditor = ({
	codeMirror: codeMirrorAtom,
	language,
	languages,
	onLanguageChange,
}: CodeEditorProps) => {
	const ref = useRef<HTMLDivElement | null>(null)
	const codeMirror = useAtom(codeMirrorAtom)

	useEffect(() => {
		const current = ref.current

		if (!current || !codeMirror) {
			return
		}

		current.appendChild(codeMirror.dom)
	}, [codeMirror])

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
