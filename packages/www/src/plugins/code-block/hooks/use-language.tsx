import { useState, useSyncExternalStore } from 'react'
import { useCodeEditor } from '../context/code-editor-context'

export const useLanguage = () => {
	const { languageRepository, bridge } = useCodeEditor()
	const language = useSyncExternalStore(
		(notify) => bridge.subscribe('language', { notify }),
		() => bridge.language,
	)
	const [value, setValue] = useState(
		() => languageRepository.getRecordById(language)?.name,
	)

	const setLanguage = (value: string) => {
		setValue(value)
		const record = languageRepository.getRecordById(value.trim().toLowerCase())
		if (record) {
			bridge.writeLanguage(record)
		}
	}

	return { language: value, setLanguage, languages: languageRepository.records }
}
