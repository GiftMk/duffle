import { PlusIcon } from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import { useCreateNote } from '@/hooks/notes'
import { ICON_SIZE_MD } from '@/lib/constants'

export const AddNoteCard = () => {
	const navigate = useNavigate()
	const createNote = useCreateNote()

	const handleClick = () => {
		const note = createNote()
		navigate({ to: '/notes/$noteId', params: { noteId: note.id } })
	}

	return (
		<button
			type='button'
			onClick={handleClick}
			className='flex h-44 w-72 shrink-0 items-center justify-center rounded-md border border-surface-400 bg-surface-50 text-typography-500 transition-colors hover:bg-surface-200 hover:text-typography-600 dark:bg-surface-300'
		>
			<PlusIcon size={ICON_SIZE_MD} />
		</button>
	)
}
