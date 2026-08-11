import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '@/server/auth.server'

const getSession = async () => {
	return auth.api.getSession({ headers: getRequestHeaders() })
}

export const getSessionFn = createServerFn({ method: 'GET' }).handler(
	getSession,
)

export const requireSession = async () => {
	const session = await getSession()

	if (!session) {
		throw new Error('Unauthorized')
	}

	return session
}
