import { createRouter, RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorPage } from './components/error-page'
import { LoadingPage } from './components/loading-page'
import { routeTree } from './routeTree.gen'
import { db } from './lib/db'
import { searchWorker } from './workers/search'

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

const start = new Date()
db.notes
	.each((note) => searchWorker.send({ type: 'add', payload: [note] }))
	.finally(() => {
		const end = new Date()
		const diff = Math.abs(start.getTime() - end.getTime())
		console.log(`Took ${diff}ms to index search.`)
	})

const root = document.getElementById('root')
if (root) {
	createRoot(root).render(
		<StrictMode>
			<RouterProvider router={router} />
		</StrictMode>,
	)
}
