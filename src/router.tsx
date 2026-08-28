import { QueryClient } from '@tanstack/react-query'
import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { ErrorPage } from '@/components/error-page'
import { LoadingPage } from '@/components/loading-page'
import { routeTree } from './routeTree.gen'

const STALE_TIME = 30_000
const GC_TIME = 5 * 60_000

export function getRouter() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: STALE_TIME,
				gcTime: GC_TIME,
			},
		},
	})

	const router = createRouter({
		routeTree,
		context: { queryClient },
		defaultPendingComponent: LoadingPage,
		defaultErrorComponent: ErrorPage,
		defaultPreload: 'intent',
		defaultStaleTime: STALE_TIME,
		defaultPreloadStaleTime: STALE_TIME,
		defaultGcTime: GC_TIME,
	})

	setupRouterSsrQueryIntegration({ router, queryClient })

	return router
}

declare module '@tanstack/react-router' {
	interface Register {
		router: ReturnType<typeof getRouter>
	}
}
