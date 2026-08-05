import { createAuthClient } from 'better-auth/react'
import { env } from '@/env'

const TOKEN_KEY = 'duffle_bearer_token'

export const authClient = createAuthClient({
	baseURL: env.VITE_API_URL,
	fetchOptions: {
		auth: {
			type: 'Bearer',
			token: () => localStorage.getItem(TOKEN_KEY) ?? '',
		},
		onSuccess: (ctx) => {
			const token = ctx.response.headers.get('set-auth-token')
			if (token) localStorage.setItem(TOKEN_KEY, token)
		},
	},
})

export const { signIn, signUp } = authClient

export const signOut = async () => {
	await authClient.signOut()
	localStorage.removeItem(TOKEN_KEY)
}
