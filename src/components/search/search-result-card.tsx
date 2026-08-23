import { Autocomplete } from '@base-ui/react'
import { NOTE_CARD_SHELL_CLASSNAME } from '@/components/notes/note-card-container'
import type { NoteEntity } from '@/lib/schemas'
import { cn } from '@/lib/utils'

type SearchResultCardProps = {
	note: NoteEntity
	index: number
	onSelect: (note: NoteEntity) => void
}

export const SearchResultCard = ({
	note,
	index,
	onSelect,
}: SearchResultCardProps) => {
	const handleSelect = () => onSelect(note)

	return (
		<Autocomplete.Item
			value={note}
			index={index}
			onClick={handleSelect}
			className={cn(
				NOTE_CARD_SHELL_CLASSNAME,
				'w-full cursor-pointer flex-col items-start justify-start gap-2 overflow-hidden bg-surface-50 p-4 text-left text-sm text-typography-950 transition-colors dark:bg-surface-300',
				'data-highlighted:bg-surface-200 data-highlighted:ring-2 data-highlighted:ring-primary-500 dark:data-highlighted:bg-surface-200',
			)}
		>
			<span
				className={cn('line-clamp-2 font-semibold', {
					'text-surface-400': !note.title,
				})}
			>
				{note.title || 'Untitled'}
			</span>
			<span className='line-clamp-4 text-typography-600'>{note.body}</span>
		</Autocomplete.Item>
	)
}
