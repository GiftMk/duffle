import { useRouteContext } from '@tanstack/react-router'
import { useSession } from '@/lib/auth-client'

export const useCurrentUser = () => {
	const { user: verifiedUser } = useRouteContext({ from: '__root__' })
	const { data: liveSession, isPending } = useSession()

	return isPending ? verifiedUser : (liveSession?.user ?? null)
}
