import { PencilSimpleLineIcon } from '@phosphor-icons/react'
import { SidebarButton } from '@/components/sidebar/sidebar-button'
import { Tooltip } from '@/components/tooltip'
import { useCreateAndOpenNote } from '@/hooks/notes'
import { ICON_SIZE_MD } from '@/lib/constants'

export const NewNoteButton = () => {
	const createAndOpenNote = useCreateAndOpenNote()

	return (
		<Tooltip content='New note'>
			<SidebarButton onClick={createAndOpenNote}>
				<PencilSimpleLineIcon size={ICON_SIZE_MD} />
			</SidebarButton>
		</Tooltip>
	)
}
