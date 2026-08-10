import { PencilSimpleLineIcon } from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import { Tooltip } from '@/components/tooltip'
import { useCreateNote } from '@/hooks/notes'
import { ICON_SIZE_MD } from '@/lib/constants'

export const NotesButton = () => {
	const createNote = useCreateNote()
	const navigate = useNavigate()

	const handleClick = () => {
		const note = createNote()
		navigate({ to: '/notes/$noteId', params: { noteId: note.id } })
	}

	return (
		<Tooltip content='Notes'>
			<button
				onClick={handleClick}
				type='button'
				className='flex h-fit w-fit scale-125 items-center justify-center rounded-full border border-surface-400 bg-surface-100 p-2 text-typography-600 transition-all duration-75 hover:scale-125 hover:bg-surface-300/50 focus:outline-none'
			>
				<PencilSimpleLineIcon size={ICON_SIZE_MD} />
			</button>
		</Tooltip>
	)
}
