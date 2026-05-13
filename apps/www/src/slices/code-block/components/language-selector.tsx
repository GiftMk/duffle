import { Autocomplete } from '@base-ui/react/autocomplete'
import { useState } from 'react'
import type { LanguageRecord } from '../lib/language-collection'
import type { Atom } from '@xstate/store'
import { useAtom } from '@xstate/store-react'

type LanguageSelectorProps = {
	language: Atom<LanguageRecord | null>
	languages: LanguageRecord[]
	onChange: (value: LanguageRecord) => void
}

export const LanguageSelector = ({
	languages,
	language,
}: LanguageSelectorProps) => {
	const currentLanguage = useAtom(language)
	const [value, setValue] = useState(currentLanguage?.name)

	return (
		<Autocomplete.Root value={value} onValueChange={setValue} items={languages}>
			<Autocomplete.Input
				placeholder='e.g. TypeScript'
				className='rounded-md border border-border'
			/>
			<Autocomplete.Portal>
				<Autocomplete.Positioner>
					<Autocomplete.Popup>
						<Autocomplete.Empty>No languages found.</Autocomplete.Empty>
						<Autocomplete.List className='h-96 overflow-y-auto rounded-md border border-border bg-background'>
							{languages.map((language) => (
								<Autocomplete.Item key={language.id} value={language.id}>
									{language.name}
								</Autocomplete.Item>
							))}
						</Autocomplete.List>
					</Autocomplete.Popup>
				</Autocomplete.Positioner>
			</Autocomplete.Portal>
		</Autocomplete.Root>
	)
}
