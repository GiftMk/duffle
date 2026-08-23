import { NOTE_CARD_SHELL_CLASSNAME } from '@/components/notes/note-card-container'
import { cn } from '@/lib/utils'

export const SearchSkeletonCard = () => {
	return (
		<div
			className={cn(
				NOTE_CARD_SHELL_CLASSNAME,
				'w-full animate-pulse flex-col items-start justify-start gap-2 border-transparent bg-surface-300 dark:bg-surface-200',
			)}
		/>
	)
}
