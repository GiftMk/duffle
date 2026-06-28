import { Input } from '@base-ui/react'
import { useEffect, useRef } from 'react'
import { useCodeEditor } from '../context/code-editor-context'
import { useLanguage } from '../hooks/use-language'

export const LanguageSelector = () => {
	const { language, setLanguage } = useLanguage()
	const { languageInput } = useCodeEditor()
	const inputRef = useRef<HTMLInputElement | null>(null)

	useEffect(() => {
		const input = inputRef.current

		if (!input) {
			return
		}

		languageInput.set(input)
	}, [languageInput])

	return (
		<Input
			value={language}
			onValueChange={setLanguage}
			ref={inputRef}
			placeholder='none'
			className='w-full rounded-t-md bg-surface-200 px-2 pt-1 pb-0.5 font-bold text-sm text-typography-500'
		/>
	)
}
