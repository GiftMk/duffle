import { PlusIcon } from '@phosphor-icons/react'
import { NOTE_CARD_SHELL_CLASSNAME } from '@/components/notes/note-card-container'
import { useCreateAndOpenNote } from '@/hooks/notes'
import { ICON_SIZE_MD } from '@/lib/constants'
import { cn } from '@/lib/utils'

export const AddNoteCard = () => {
	const createAndOpenNote = useCreateAndOpenNote()

	return (
		<button
			type='button'
			onClick={createAndOpenNote}
			className={cn(
				NOTE_CARD_SHELL_CLASSNAME,
				'bg-surface-50 text-typography-500 transition-colors hover:bg-surface-200 hover:text-typography-600 dark:bg-surface-300',
			)}
		>
			<PlusIcon size={ICON_SIZE_MD} />
		</button>
	)
}
