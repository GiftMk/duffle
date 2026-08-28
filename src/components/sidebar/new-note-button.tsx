import { PencilSimpleLineIcon } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { SidebarButton } from '@/components/sidebar/sidebar-button'
import { Tooltip } from '@/components/tooltip'
import { ICON_SIZE_MD } from '@/lib/constants'
import { noteQueryOptions } from '@/lib/queries/note'
import { cn, emptyNote } from '@/lib/utils'
import { createNoteFn } from '@/server/notes.functions'

type NewNoteButtonProps = {
	disabled?: boolean
}

export const NewNoteButton = ({ disabled }: NewNoteButtonProps) => {
	const navigate = useNavigate()
	const router = useRouter()
	const queryClient = useQueryClient()

	const handleClick = async () => {
		const note = await createNoteFn({ data: emptyNote() })
		if (note) {
			queryClient.setQueryData(noteQueryOptions(note.id).queryKey, note)
			router.invalidate()
			navigate({ to: '/notes/$noteId', params: { noteId: note.id } })
		}
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
