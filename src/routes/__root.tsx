import { type QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from '@tanstack/react-router'
import '@/index.css'
import { Analytics } from '@vercel/analytics/next'
import { LoadingPage } from '@/components/loading-page'
import { ThemeProvider } from '@/components/sidebar/theme-provider'
import { TooltipProvider } from '@/components/tooltip'
import { getCurrentUserFn } from '@/server/auth.functions'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
	{
		ssr: true,
		beforeLoad: async ({ location }) => {
			if (location.pathname.startsWith('/api/auth')) {
				return { user: null }
			}

			return { user: await getCurrentUserFn() }
		},
		pendingComponent: LoadingPage,
		shellComponent: RootDocument,
	},
)

function RootDocument({ children }: { children: React.ReactNode }) {
	const { queryClient } = Route.useRouteContext()

	return (
		<html lang='en'>
			<head>
				<meta charSet='UTF-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1.0' />
				<title>Duffle</title>
				<HeadContent />
			</head>
			<body className='text-typography-950'>
				<QueryClientProvider client={queryClient}>
					<ThemeProvider>
						<TooltipProvider delay={300}>{children}</TooltipProvider>
					</ThemeProvider>
				</QueryClientProvider>
				<Analytics />
				<Scripts />
			</body>
		</html>
	)
}
