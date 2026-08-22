import { BooksIcon } from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import { Tooltip } from '@/components/tooltip'
import { ICON_SIZE_MD } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { SidebarButton } from './sidebar-button'

type NotesButtonProps = {
	disabled?: boolean
}

export const NotesButton = ({ disabled }: NotesButtonProps) => {
	const navigate = useNavigate()

	const handleClick = () => {
		if (disabled) return
		navigate({ to: '/notes' })
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
				<BooksIcon size={ICON_SIZE_MD} />
			</SidebarButton>
		</Tooltip>
	)
}
