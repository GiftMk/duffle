import { useState, useSyncExternalStore } from 'react'
import { useCodeEditor } from '../context/code-editor-context'

type Item = {
	id: string
	value: string
}

export const useLanguage = () => {
	const { languageRepository, bridge } = useCodeEditor()
	const language = useSyncExternalStore(
		(notify) => bridge.subscribe('language', { notify }),
		() => bridge.language,
	)
	const [value, setValue] = useState(() => language)
	const items: Item[] = languageRepository.records.map((language) => ({
		id: language.id,
		value: language.name,
	}))

	const setLanguage = (value: string) => {
		setValue(value)
		const record = languageRepository.getRecordById(value)
		if (record) {
			bridge.writeLanguage(record)
		}
	}

	return { language: value, setLanguage, items }
}
