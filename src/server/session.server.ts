import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '@/server/auth.server'

const getCurrentUser = async () => {
	const session = await auth.api.getSession({ headers: getRequestHeaders() })
	return session?.user ?? null
}

export const ensureCurrentUser = async () => {
	const existing = await getCurrentUser()
	if (existing) return existing

	const { user } = await auth.api.signInAnonymous({
		headers: getRequestHeaders(),
	})
	return user
}

export const ensureCurrentUserFn = createServerFn({ method: 'GET' }).handler(
	ensureCurrentUser,
)
