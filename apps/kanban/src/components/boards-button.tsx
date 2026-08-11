import { SidebarButton, Tooltip } from '@duffle/ui'
import { cn } from '@duffle/utils'
import { ICON_SIZE_MD } from '@duffle/utils/constants'
import { KanbanIcon } from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'

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
