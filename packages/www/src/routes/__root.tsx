import { createRootRoute, HeadContent, Outlet } from '@tanstack/react-router'
import '@/index.css'
import { LoadingPage } from '@/components/loading-page'
import { ThemeProvider } from '@/components/theme-provider'

export const Route = createRootRoute({
	pendingComponent: LoadingPage,
	component: RootLayout,
})

function RootLayout() {
	return (
		<ThemeProvider>
			<HeadContent />
			<Outlet />
		</ThemeProvider>
	)
}
