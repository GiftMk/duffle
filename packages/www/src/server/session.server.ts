import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '@/server/auth.server'

export const getSession = async () => {
	return auth.api.getSession({ headers: getRequestHeaders() })
}

export const requireSession = async () => {
	const session = await getSession()

	if (!session) {
		throw new Error('Unauthorized')
	}

	return session
}
