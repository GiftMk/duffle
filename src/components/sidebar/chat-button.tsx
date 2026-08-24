import { ChatsIcon } from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import { Tooltip } from '@/components/tooltip'
import { useAiChatEnabled } from '@/hooks/ai'
import { ICON_SIZE_MD } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { SidebarButton } from './sidebar-button'

export const ChatButton = () => {
	const navigate = useNavigate()
	const aiChatEnabled = useAiChatEnabled()

	const handleClick = () => {
		if (!aiChatEnabled) return
		navigate({ to: '/chat' })
	}

	return (
		<Tooltip content='Chat'>
			<SidebarButton
				onClick={handleClick}
				disabled={!aiChatEnabled}
				aria-disabled={!aiChatEnabled}
				className={cn({
					'pointer-events-none opacity-40': !aiChatEnabled,
				})}
			>
				<ChatsIcon size={ICON_SIZE_MD} />
			</SidebarButton>
		</Tooltip>
	)
}
