import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ChatComposer } from '@/components/ai/chat-composer'
import { ChatEmptyState } from '@/components/ai/chat-empty-state'
import { ChatTranscript } from '@/components/ai/chat-transcript'
import { FadeIn } from '@/components/animations'
import { createChatInstance, isChatBusy, useDuffleChat } from '@/hooks/ai'

export const Route = createFileRoute('/_app/chat')({
	component: RouteComponent,
})

function RouteComponent() {
	const [chat] = useState(() => createChatInstance())
	const { messages, status, error, input, setInput, submit, canSubmit } =
		useDuffleChat(chat)
	const hasMessages = messages.length > 0

	const composer = (
		<ChatComposer
			input={input}
			setInput={setInput}
			onSubmit={submit}
			canSubmit={canSubmit}
		/>
	)

	return (
		<div className='flex h-full w-full flex-col'>
			<header className='shrink-0 px-8 py-5'>
				<h1 className='font-bold text-3xl tracking-tight'>Sir Duffle</h1>
			</header>

			{hasMessages ? (
				<>
					<FadeIn className='flex min-h-0 flex-1 flex-col'>
						<ChatTranscript
							messages={messages}
							isStreaming={isChatBusy(status)}
							isThinking={status === 'submitted'}
						/>
					</FadeIn>

					{error && (
						<p className='mx-auto w-full max-w-3xl shrink-0 px-8 pt-3 text-red-700 text-sm'>
							{error.message}
						</p>
					)}

					<div className='shrink-0 px-8 pb-6'>{composer}</div>
				</>
			) : (
				<div className='flex min-h-0 flex-1 flex-col items-center justify-center gap-6 px-8'>
					<ChatEmptyState />
					{error && (
						<p className='mx-auto w-full max-w-3xl text-center text-red-700 text-sm'>
							{error.message}
						</p>
					)}
					{composer}
				</div>
			)}
		</div>
	)
}
