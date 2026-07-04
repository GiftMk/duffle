import { useState, useSyncExternalStore } from 'react'
import { useCodeEditor } from './use-code-editor'
import { escapeCodeMirror } from '../lib/utils'

export const useLanguage = () => {
	const { languageRepository, bridge, getPos, node, view, codeMirror } =
		useCodeEditor()
	const language = useSyncExternalStore(
		(notify) => bridge.subscribe('language', { notify }),
		() => bridge.language,
	)
	const [value, setValue] = useState(
		() => languageRepository.getRecordById(language)?.name ?? '',
	)

	const setLanguage = (value: string) => {
		setValue(value)
		const record = languageRepository.getRecordById(value.trim().toLowerCase())
		if (record) {
			bridge.writeLanguage(record)
		}
	}

	const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (!codeMirror.value) {
			return
		}

		switch (e.key) {
			case 'ArrowDown': {
				e.preventDefault()
				codeMirror.value.focus()
				codeMirror.value.dispatch({
					selection: { anchor: 0, head: 0 },
					scrollIntoView: true,
				})
				break
			}
			case 'ArrowUp': {
				e.preventDefault()
				escapeCodeMirror('line', -1, {
					codeMirror: codeMirror.value,
					view,
					node: node.value,
					getPos,
				})
				break
			}
		}
	}

	return {
		language: value,
		setLanguage,
		languages: languageRepository.records,
		onKeyDown,
	}
}
