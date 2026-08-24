import { ArrowDownIcon } from '@phosphor-icons/react'
import type { UIMessage } from 'ai'
import { StickToBottom, useStickToBottomContext } from 'use-stick-to-bottom'
import { ChatMessage } from '@/components/ai/chat-message'
import { ChatThinking } from '@/components/ai/chat-thinking'
import { ICON_SIZE_MD } from '@/lib/constants'

type ChatTranscriptProps = {
	messages: UIMessage[]
	isStreaming: boolean
	isThinking: boolean
}

export const ChatTranscript = ({
	messages,
	isStreaming,
	isThinking,
}: ChatTranscriptProps) => {
	return (
		<StickToBottom
			className='relative min-h-0 flex-1'
			resize='smooth'
			initial='smooth'
		>
			<StickToBottom.Content className='mx-auto flex w-full max-w-3xl flex-col gap-6 px-8 py-6'>
				{messages.map((message, index) => (
					<ChatMessage
						key={message.id}
						message={message}
						isStreaming={isStreaming && index === messages.length - 1}
					/>
				))}
				{isThinking && <ChatThinking />}
			</StickToBottom.Content>
			<ScrollToBottomButton />
		</StickToBottom>
	)
}

const ScrollToBottomButton = () => {
	const { isAtBottom, scrollToBottom } = useStickToBottomContext()

	if (isAtBottom) return null

	return (
		<button
			type='button'
			onClick={() => scrollToBottom()}
			className='absolute bottom-4 left-1/2 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-surface-400 bg-surface-50 text-surface-800 shadow-lg hover:bg-surface-200'
		>
			<ArrowDownIcon size={ICON_SIZE_MD} />
		</button>
	)
}
