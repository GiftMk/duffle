import { NotePencilIcon } from '@phosphor-icons/react/dist/ssr'
import { useHotkey } from '@tanstack/react-hotkeys'
import { useNavigate } from '@tanstack/react-router'
import { createNote } from '@/lib/actions'
import { ICON_SIZE_PX } from '@/lib/utils'

export const NewNoteButton = () => {
	const navigate = useNavigate()

	const handleClick = async () => {
		const id = await createNote()
		navigate({ to: '/notes/$noteId', params: { noteId: id } })
	}

	useHotkey('Mod+Enter', handleClick)

	return (
		<button
			onClick={handleClick}
			type='button'
			className='flex h-fit w-fit items-center justify-center rounded-full border border-surface-400 bg-surface-100 p-2 text-typography-600 hover:bg-surface-300/50 focus:outline-none'
		>
			<NotePencilIcon size={ICON_SIZE_PX} weight='bold' />
		</button>
	)
}
