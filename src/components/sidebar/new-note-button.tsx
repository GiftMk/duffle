import { PencilSimpleLineIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { uuidv7 } from 'uuidv7'
import { SidebarButton } from '@/components/sidebar/sidebar-button'
import { Tooltip } from '@/components/tooltip'
import { useNewNote } from '@/hooks/notes'
import { ICON_SIZE_MD } from '@/lib/constants'
import { cn } from '@/lib/utils'

type NewNoteButtonProps = {
	disabled?: boolean
}

export const NewNoteButton = ({ disabled }: NewNoteButtonProps) => {
	const [noteId, setNoteId] = useState(() => uuidv7())
	const newNote = useNewNote(noteId)

	const handleClick = () => {
		newNote.create()
		newNote.open()
		setNoteId(uuidv7())
	}

	return (
		<Tooltip content='New note'>
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
