import { useEffect, useRef } from 'react'
import { useCodeEditor } from '../context/code-editor-context'
import { LanguageSelector } from './language-selector'

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
