import { createRootRoute, Outlet } from '@tanstack/react-router'
import '@/index.css'
import { LoadingPage } from '@/components/loading-page'
import { db } from '@/lib/db'
import { searchWorker } from '@/workers/search'

export const Route = createRootRoute({
	pendingComponent: LoadingPage,
	component: RootLayout,
})

function RootLayout() {
	return <Outlet />
}
