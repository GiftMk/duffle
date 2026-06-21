import { createRootRoute, Outlet } from '@tanstack/react-router'
import '@/index.css'
import { LoadingPage } from '@/components/loading-page'
import { db, miniSearch } from '@/lib/db'

export const Route = createRootRoute({
	pendingComponent: LoadingPage,
	component: RootLayout,
	beforeLoad: () => {
		const start = new Date()

		db.notes
			.each((note) => {
				miniSearch.add(note)
			})
			.finally(() => {
				const end = new Date()
				const diff = Math.abs(start.getTime() - end.getTime())

				console.log(`Took ${diff}ms to index search.`)
			})
	},
})

function RootLayout() {
	return <Outlet />
}
