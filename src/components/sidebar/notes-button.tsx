import { BooksIcon } from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import { Tooltip } from '@/components/tooltip'
import { ICON_SIZE_MD } from '@/lib/constants'
import { SidebarButton } from './sidebar-button'

export const NotesButton = () => {
	const navigate = useNavigate()

	const handleClick = () => {
		navigate({ to: '/notes' })
	}

	return (
		<Tooltip content='Notes'>
			<SidebarButton onClick={handleClick}>
				<BooksIcon size={ICON_SIZE_MD} />
			</SidebarButton>
		</Tooltip>
	)
}
