import { Chat, useChat } from '@ai-sdk/react'
import { useQuery } from '@tanstack/react-query'
import { type ChatStatus, DefaultChatTransport, type UIMessage } from 'ai'
import { useState } from 'react'
import { getAiChatEnabledFn } from '@/server/ai/config.functions'

export const createChatInstance = () =>
	new Chat({
		transport: new DefaultChatTransport({ api: '/api/chat' }),
	})

// Cached for the whole session, since it never changes without a redeploy.
export const useAiChatEnabled = () => {
	const { data } = useQuery({
		queryKey: ['ai-chat-enabled'],
		queryFn: () => getAiChatEnabledFn(),
		staleTime: Number.POSITIVE_INFINITY,
	})

	return data ?? false
}

export const isChatBusy = (status: ChatStatus): boolean => {
	return status === 'submitted' || status === 'streaming'
}

type UseDuffleChatResult = {
	messages: UIMessage[]
	status: ChatStatus
	error: Error | undefined
	input: string
	setInput: (input: string) => void
	submit: () => void
	stop: () => void
	canSubmit: boolean
}

export const useDuffleChat = (chat: Chat<UIMessage>): UseDuffleChatResult => {
	const { messages, sendMessage, status, error, stop } = useChat({ chat })
	const [input, setInput] = useState('')

	const busy = isChatBusy(status)
	const canSubmit = input.trim().length > 0 && !busy

	const submit = () => {
		if (!canSubmit) return

		sendMessage({ text: input })
		setInput('')
	}

	return {
		messages,
		status,
		error,
		input,
		setInput,
		submit,
		stop,
		canSubmit,
	}
}
