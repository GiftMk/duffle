import { ChatsIcon } from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import { Tooltip } from '@/components/tooltip'
import { useAiChatEnabled } from '@/hooks/ai'
import { ICON_SIZE_MD } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { SidebarButton } from './sidebar-button'

type ChatButtonProps = {
	disabled?: boolean
}

export const ChatButton = ({ disabled }: ChatButtonProps) => {
	const navigate = useNavigate()
	const aiChatEnabled = useAiChatEnabled()
	const isDisabled = disabled || !aiChatEnabled

	const handleClick = () => {
		if (isDisabled) return
		navigate({ to: '/chat' })
	}

	return (
		<Tooltip content='Chat'>
			<SidebarButton
				onClick={handleClick}
				disabled={isDisabled}
				aria-disabled={isDisabled}
				className={cn({
					'pointer-events-none opacity-40': isDisabled,
				})}
			>
				<ChatsIcon size={ICON_SIZE_MD} />
			</SidebarButton>
		</Tooltip>
	)
}
