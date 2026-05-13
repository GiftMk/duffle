import { createRootRoute, Outlet } from '@tanstack/react-router'
import '../common/css/index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const Route = createRootRoute({ component: RootLayout })

const queryClient = new QueryClient()

function RootLayout() {
	return (
		<QueryClientProvider client={queryClient}>
			<Outlet />
		</QueryClientProvider>
	)
}
