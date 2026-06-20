import { createRootRoute, Outlet } from '@tanstack/react-router'
import '@/index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LoadingPage } from '@/components/loading-page'

export const Route = createRootRoute({
	pendingComponent: LoadingPage,
	component: RootLayout,
})

const queryClient = new QueryClient()

function RootLayout() {
	return (
		<QueryClientProvider client={queryClient}>
			<Outlet />
		</QueryClientProvider>
	)
}
