import { SidebarButton, Tooltip } from '@duffle/ui'
import { cn } from '@duffle/utils'
import { ICON_SIZE_MD } from '@duffle/utils/constants'
import { PencilSimpleLineIcon } from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import { useCreateNote } from '@/hooks/notes'

type NotesButtonProps = {
	active?: boolean
	disabled?: boolean
}

export const NotesButton = ({ active, disabled }: NotesButtonProps) => {
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
					'scale-125 bg-surface-200': active,
					'pointer-events-none opacity-40': disabled,
				})}
			>
				<PencilSimpleLineIcon size={ICON_SIZE_MD} />
			</SidebarButton>
		</Tooltip>
	)
}
