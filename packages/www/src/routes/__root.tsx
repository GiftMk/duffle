import { createRootRoute, HeadContent, Outlet } from '@tanstack/react-router'
import '@/index.css'
import { LoadingPage } from '@/components/loading-page'

export const Route = createRootRoute({
	pendingComponent: LoadingPage,
	component: RootLayout,
})

function RootLayout() {
	return (
		<>
			<HeadContent />
			<Outlet />
		</>
	)
}
