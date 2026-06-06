import { useEffect, useRef } from 'react'
import { LanguageSelector } from './language-selector'
import './code-mirror.css'
import { useCodeEditor } from '../state/code-editor-context'

export const CodeEditor = () => {
	const ref = useRef<HTMLDivElement | null>(null)
	const { codeMirror } = useCodeEditor()

	useEffect(() => {
		const current = ref.current

		if (!current || !codeMirror) {
			return
		}

		current.appendChild(codeMirror.dom)

		return () => {
			current.removeChild(codeMirror.dom)
		}
	}, [codeMirror])

	return (
		<div>
			<LanguageSelector />
			<div ref={ref} />
		</div>
	)
}
