import { createRouter, RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorPage } from './components/error-page'
import { LoadingPage } from './components/loading-page'
import { routeTree } from './routeTree.gen'

const router = createRouter({
	routeTree,
	defaultPendingComponent: LoadingPage,
	defaultErrorComponent: ErrorPage,
})

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

const root = document.getElementById('root')

if (root) {
	createRoot(root).render(
		<StrictMode>
			<RouterProvider router={router} />
		</StrictMode>,
	)
}
