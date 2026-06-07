import { Autocomplete } from '@base-ui/react/autocomplete'
import { useLanguage } from '../hooks/use-language'

export const LanguageSelector = () => {
	const { language, setLanguage, items } = useLanguage()

	return (
		<Autocomplete.Root
			items={items}
			value={language}
			onValueChange={setLanguage}
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
