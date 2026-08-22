import { useRouteContext } from '@tanstack/react-router'
import { useSession } from '@/lib/auth-client'

/**
 * Falls back to the session the root route's `beforeLoad` already verified
 * server-side while the client-only `useSession()` store is still doing its
 * post-hydration refetch, so already-authenticated users never see a
 * logged-out flash on refresh.
 */
export const useCurrentSession = () => {
	const { session: verifiedSession } = useRouteContext({ from: '__root__' })
	const { data: liveSession, isPending } = useSession()

	return isPending ? verifiedSession : liveSession
}
