import { createServerFn } from '@tanstack/react-start'
import { getCurrentUser } from '@/server/auth.server'

export const getCurrentUserFn = createServerFn({ method: 'GET' }).handler(
	getCurrentUser,
)
