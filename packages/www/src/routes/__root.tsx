import { createRootRoute, Outlet } from '@tanstack/react-router'
import '@/index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { initDb } from '@/lib/db'
import { LoadingPage } from '@/components/loading-page'

export const Route = createRootRoute({
	component: RootLayout,
	beforeLoad: async () => {
		initDb()
	},
	pendingComponent: LoadingPage,
})

const queryClient = new QueryClient()

function RootLayout() {
	return (
		<QueryClientProvider client={queryClient}>
			<Outlet />
		</QueryClientProvider>
	)
}
