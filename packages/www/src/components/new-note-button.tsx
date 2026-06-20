import { PenNibIcon } from '@phosphor-icons/react/dist/ssr'
import { useNavigate } from '@tanstack/react-router'
import { createNote } from '@/lib/actions'

export const NewNoteButton = () => {
	const navigate = useNavigate()

	const handleClick = () => {
		const id = createNote()
		console.log('created a new note', id)
		navigate({ to: '/notes/$noteId', params: { noteId: id } })
	}

	return (
		<button
			onClick={handleClick}
			type='button'
			className='flex h-fit w-fit items-center justify-center rounded-full border border-surface-400 bg-surface-100 p-2 text-typography-600 hover:bg-surface-300/50 focus:outline-none'
		>
			<PenNibIcon size={20} />
		</button>
	)
}
