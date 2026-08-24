import { createServerFn } from '@tanstack/react-start'
import { env } from '@/env'

export const getAiChatEnabledFn = createServerFn({ method: 'GET' }).handler(
	async () => Boolean(env.OPENAI_API_KEY),
)
