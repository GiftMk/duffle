import { Autocomplete } from '@base-ui/react/autocomplete'
import { useEffect, useRef } from 'react'
import { useCodeEditor } from '../context/code-editor-context'
import { useLanguage } from '../hooks/use-language'
import type { LanguageRecord } from '../lib/language-repository'

export const LanguageSelector = () => {
	const { language, setLanguage, languages } = useLanguage()
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
		<Autocomplete.Root
			items={languages}
			value={language}
			onValueChange={setLanguage}
			itemToStringValue={(item) => item.name}
			autoHighlight={'always'}
		>
			<Autocomplete.Input
				ref={inputRef}
				placeholder='none'
				className='w-full rounded-t-md font-bold bg-surface-200 px-2 pt-1 pb-0.5 text-sm text-typography-500'
			/>
			<Autocomplete.Portal>
				<Autocomplete.Positioner align='start'>
					<Autocomplete.Popup
						className={
							'overflow-hidden rounded-sm border border-border bg-surface-100'
						}
					>
						<Autocomplete.Empty>
							<p className='px-4 py-1.5'>No languages found.</p>
						</Autocomplete.Empty>
						<Autocomplete.List className='max-h-96 min-h-42 min-w-52 overflow-y-auto overscroll-contain rounded-sm p-1'>
							{(item: LanguageRecord) => (
								<Autocomplete.Item
									className={
										'px-4 py-1.5 text-sm hover:bg-stone-200 data-highlighted:bg-stone-200'
									}
									key={item.id}
									value={item}
								>
									{item.name}
								</Autocomplete.Item>
							)}
						</Autocomplete.List>
					</Autocomplete.Popup>
				</Autocomplete.Positioner>
			</Autocomplete.Portal>
		</Autocomplete.Root>
	)
}
