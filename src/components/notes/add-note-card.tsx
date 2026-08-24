import { PlusIcon } from '@phosphor-icons/react'
import { NOTE_CARD_SHELL_CLASSNAME } from '@/components/notes/note-card-container'
import { ICON_SIZE_MD } from '@/lib/constants'
import { cn } from '@/lib/utils'

type AddNoteCardProps = {
	onClick: () => void
}

export const AddNoteCard = ({ onClick }: AddNoteCardProps) => {
	return (
		<button
			type='button'
			onClick={onClick}
			className={cn(
				NOTE_CARD_SHELL_CLASSNAME,
				'bg-surface-50 text-typography-500 transition-colors hover:bg-surface-200 hover:text-typography-600 dark:bg-surface-300',
			)}
		>
			<PlusIcon size={ICON_SIZE_MD} />
		</button>
	)
}
