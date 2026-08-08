import { QueryClient } from '@tanstack/react-query'
import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { ErrorPage } from './components/error-page'
import { LoadingPage } from './components/loading-page'
import { routeTree } from './routeTree.gen'

export function getRouter() {
	const queryClient = new QueryClient()

	const router = createRouter({
		routeTree,
		context: { queryClient },
		defaultPendingComponent: LoadingPage,
		defaultErrorComponent: ErrorPage,
	})

	setupRouterSsrQueryIntegration({ router, queryClient })

	return router
}

declare module '@tanstack/react-router' {
	interface Register {
		router: ReturnType<typeof getRouter>
	}
}
