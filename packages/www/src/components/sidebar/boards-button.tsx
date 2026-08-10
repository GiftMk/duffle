import { KanbanIcon } from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import { ICON_SIZE_MD } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Tooltip } from '../tooltip'
import { SidebarButton } from './sidebar-button'

type BoardsButtonProps = {
	active?: boolean
	disabled?: boolean
}

export const BoardsButton = ({ active, disabled }: BoardsButtonProps) => {
	const navigate = useNavigate()

	const handleClick = () => {
		if (disabled) return
		navigate({ to: '/boards' })
	}

	return (
		<Tooltip content='Boards'>
			<SidebarButton
				onClick={handleClick}
				disabled={disabled}
				aria-disabled={disabled}
				className={cn({
					'scale-125 bg-surface-200': active,
					'pointer-events-none opacity-40': disabled,
				})}
			>
				<KanbanIcon size={ICON_SIZE_MD} />
			</SidebarButton>
		</Tooltip>
	)
}
