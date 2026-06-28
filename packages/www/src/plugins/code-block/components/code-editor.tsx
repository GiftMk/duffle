import { useEffect, useRef } from 'react'
import { useCodeEditor } from '../context/code-editor-context'
import { LanguageSelector } from './language-selector'
import './code-mirror.css'

export const CodeEditor = () => {
	const ref = useRef<HTMLDivElement | null>(null)
	const { codeMirror } = useCodeEditor()

	useEffect(() => {
		const current = ref.current

		if (!current || !codeMirror.hasValue) {
			return
		}

		current.appendChild(codeMirror.value.dom)

		return () => {
			current.removeChild(codeMirror.value.dom)
		}
	}, [codeMirror])

	return (
		<div
			contentEditable={false}
			className='relative overflow-hidden rounded-md'
		>
			<LanguageSelector />
			<div ref={ref} />
		</div>
	)
}
