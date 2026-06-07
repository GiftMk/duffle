import { Autocomplete } from '@base-ui/react/autocomplete'
import { useAtom } from '@tanstack/react-store'
import { useState } from 'react'
import { useCodeEditor } from '../context/code-editor-context'

type Item = {
	id: string
	value: string
}

export const LanguageSelector = () => {
	const { languageAtom, languageRepository, bridge } = useCodeEditor()
	const [language, setLanguage] = useAtom(languageAtom)
	const [value, setValue] = useState(() => language?.id)
	const items: Item[] = languageRepository.records.map((language) => ({
		id: language.id,
		value: language.name,
	}))

	const handleValueChange = (value: string) => {
		setValue(value)

		const record = languageRepository.getRecordById(value)
		console.log(value, record)
		if (record) {
			setLanguage(record)
			bridge.readLanguage()
			bridge.writeLanguage(record)
		}
	}

	return (
		<Autocomplete.Root
			items={items}
			value={value}
			onValueChange={handleValueChange}
		>
			<Autocomplete.Input
				id='language-selector'
				placeholder='none'
				className='rounded-md px-2 py-1.5'
			/>
			<Autocomplete.Portal>
				<Autocomplete.Positioner align='start'>
					<Autocomplete.Popup
						className={
							'overflow-hidden rounded-sm border border-border bg-background'
						}
					>
						<Autocomplete.Empty>
							<p className='px-4 py-1.5'>No languages found.</p>
						</Autocomplete.Empty>
						<Autocomplete.List className='max-h-96 min-h-42 min-w-52 overflow-y-auto overscroll-contain rounded-sm p-1'>
							{(item: { id: string; value: string }) => (
								<Autocomplete.Item
									className={
										'px-4 py-1.5 hover:bg-zinc-300 data-highlighted:bg-zinc-300'
									}
									key={item.id}
									value={item.id}
								>
									{item.value}
								</Autocomplete.Item>
							)}
						</Autocomplete.List>
					</Autocomplete.Popup>
				</Autocomplete.Positioner>
			</Autocomplete.Portal>
		</Autocomplete.Root>
	)
}
