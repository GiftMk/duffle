import { openai } from '@ai-sdk/openai'
import { createFileRoute } from '@tanstack/react-router'
import {
	convertToModelMessages,
	createUIMessageStreamResponse,
	isStepCount,
	streamText,
	toUIMessageStream,
	type UIMessage,
} from 'ai'
import { getDb } from '@/db'
import { env } from '@/env'
import { CHAT_MAX_STEPS, CHAT_MODEL } from '@/lib/constants'
import { CHAT_SYSTEM_PROMPT } from '@/server/ai/system-prompt'
import { createRecentNotesTool } from '@/server/ai/tools'
import { auth } from '@/server/auth.server'

export const Route = createFileRoute('/api/chat')({
	server: {
		handlers: {
			POST: async ({ request }: { request: Request }) => {
				if (!env.OPENAI_API_KEY) {
					return new Response('AI chat is disabled', { status: 503 })
				}

				const session = await auth.api.getSession({
					headers: request.headers,
				})

				if (!session) {
					return new Response('Unauthorized', { status: 401 })
				}

				const { messages }: { messages: UIMessage[] } = await request.json()
				const db = await getDb()

				const result = streamText({
					model: openai(CHAT_MODEL),
					system: CHAT_SYSTEM_PROMPT,
					messages: await convertToModelMessages(messages),
					stopWhen: isStepCount(CHAT_MAX_STEPS),
					tools: {
						recentNotes: createRecentNotesTool({
							db,
							userId: session.user.id,
						}),
					},
				})

				return createUIMessageStreamResponse({
					stream: toUIMessageStream({ stream: result.stream }),
				})
			},
		},
	},
})
