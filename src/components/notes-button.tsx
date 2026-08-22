import { PencilSimpleLineIcon } from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import { SidebarButton } from '@/components/sidebar/sidebar-button'
import { Tooltip } from '@/components/tooltip'
import { useCreateNote } from '@/hooks/notes'
import { ICON_SIZE_MD } from '@/lib/constants'
import { cn } from '@/lib/utils'

type NotesButtonProps = {
	disabled?: boolean
}

export const NotesButton = ({ disabled }: NotesButtonProps) => {
	const createNote = useCreateNote()
	const navigate = useNavigate()

	const handleClick = () => {
		const note = createNote()
		navigate({ to: '/notes/$noteId', params: { noteId: note.id } })
	}

	return (
		<Tooltip content='Notes'>
			<SidebarButton
				onClick={handleClick}
				disabled={disabled}
				aria-disabled={disabled}
				className={cn({
					'pointer-events-none opacity-40': disabled,
				})}
			>
				<PencilSimpleLineIcon size={ICON_SIZE_MD} />
			</SidebarButton>
		</Tooltip>
	)
}
