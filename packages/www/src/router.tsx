import { createRouter } from '@tanstack/react-router'
import { ErrorPage } from './components/error-page'
import { LoadingPage } from './components/loading-page'
import { routeTree } from './routeTree.gen'

export function getRouter() {
	return createRouter({
		routeTree,
		defaultPendingComponent: LoadingPage,
		defaultErrorComponent: ErrorPage,
	})
}

declare module '@tanstack/react-router' {
	interface Register {
		router: ReturnType<typeof getRouter>
	}
}
