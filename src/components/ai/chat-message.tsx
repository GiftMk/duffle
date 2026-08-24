import { getToolName, isToolUIPart, type UIMessage } from 'ai'
import { ChatMarkdown } from '@/components/ai/chat-markdown'
import { cn } from '@/lib/utils'

type ChatMessageProps = {
	message: UIMessage
	isStreaming: boolean
}

export const ChatMessage = ({ message, isStreaming }: ChatMessageProps) => {
	const isUser = message.role === 'user'

	return (
		<div className={cn('flex', { 'justify-end': isUser })}>
			<div
				className={cn('min-w-0', {
					'max-w-[80%] rounded-md bg-surface-200 px-4 py-3 text-typography-950':
						isUser,
					'w-full text-typography-950': !isUser,
				})}
			>
				{message.parts.map((part, index) => (
					<ChatMessagePart
						// biome-ignore lint/suspicious/noArrayIndexKey: part order within a message is stable
						key={index}
						part={part}
						isStreaming={isStreaming}
					/>
				))}
			</div>
		</div>
	)
}

type ChatMessagePartProps = {
	part: UIMessage['parts'][number]
	isStreaming: boolean
}

const ChatMessagePart = ({ part, isStreaming }: ChatMessagePartProps) => {
	if (part.type === 'text') {
		return <ChatMarkdown isAnimating={isStreaming}>{part.text}</ChatMarkdown>
	}

	if (isToolUIPart(part) && getToolName(part) === 'recentNotes') {
		const label =
			part.state === 'output-available'
				? 'Perused your 20 most recent notes'
				: 'Perusing your recent notes…'

		return <p className='text-typography-600 text-xs'>{label}</p>
	}

	return null
}
