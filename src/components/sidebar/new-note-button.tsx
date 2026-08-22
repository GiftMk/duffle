import { PencilSimpleLineIcon } from '@phosphor-icons/react'
import { SidebarButton } from '@/components/sidebar/sidebar-button'
import { Tooltip } from '@/components/tooltip'
import { useCreateAndOpenNote } from '@/hooks/notes'
import { ICON_SIZE_MD } from '@/lib/constants'
import { cn } from '@/lib/utils'

type NewNoteButtonProps = {
	disabled?: boolean
}

export const NewNoteButton = ({ disabled }: NewNoteButtonProps) => {
	const createAndOpenNote = useCreateAndOpenNote()

	return (
		<Tooltip content='New note'>
			<SidebarButton
				onClick={createAndOpenNote}
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
