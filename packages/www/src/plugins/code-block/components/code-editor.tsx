import { useAtom } from '@tanstack/react-store'
import { useEffect, useRef } from 'react'
import { useCodeEditor } from '../context/code-editor-context'
import { LanguageSelector } from './language-selector'
import './code-mirror.css'

export const CodeEditor = () => {
	const ref = useRef<HTMLDivElement | null>(null)
	const { codeMirrorAtom } = useCodeEditor()
	const [codeMirror] = useAtom(codeMirrorAtom)

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
		<div className='bg-code-block rounded-md overflow-hidden'>
			<LanguageSelector />
			<div ref={ref} />
		</div>
	)
}
