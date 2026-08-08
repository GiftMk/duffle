import { NotePencilIcon } from '@phosphor-icons/react'
import { useHotkey } from '@tanstack/react-hotkeys'
import { useNavigate } from '@tanstack/react-router'
import { Tooltip } from '@/components/tooltip'
import { createNote } from '@/lib/actions'
import { ICON_SIZE_MD } from '@/lib/constants'

export const NewNoteButton = () => {
	const navigate = useNavigate()

	const handleClick = () => {
		const note = createNote()
		navigate({ to: '/notes/$noteId', params: { noteId: note.id } })
	}

	useHotkey('Mod+Enter', handleClick)

	return (
		<Tooltip content='Create note'>
			<button
				onClick={handleClick}
				type='button'
				className='flex h-fit w-fit items-center justify-center rounded-full border border-surface-400 bg-surface-100 p-2 text-typography-600 transition-all duration-75 hover:scale-125 hover:bg-surface-300/50 focus:outline-none'
			>
				<NotePencilIcon size={ICON_SIZE_MD} weight='bold' />
			</button>
		</Tooltip>
	)
}
