import { createServerFn } from '@tanstack/react-start'
import { ensureCurrentUser } from '@/server/session.server'

export const ensureCurrentUserFn = createServerFn({ method: 'GET' }).handler(
	ensureCurrentUser,
)
