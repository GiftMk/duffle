import type { QueryClient } from '@tanstack/react-query'
import {
	createRootRouteWithContext,
	HeadContent,
	redirect,
	Scripts,
} from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import '@/index.css'
import { LoadingPage } from '@/components/loading-page'
import { ThemeProvider } from '@/components/sidebar/theme-provider'
import { TooltipProvider } from '@/components/tooltip'
import { getSession, useSession } from '@/lib/auth'
import { preloadSearchIndex } from '@/lib/search'

const PUBLIC_PATHS = ['/', '/login']

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
	{
		ssr: true,
		beforeLoad: async ({ location }) => {
			if (
				PUBLIC_PATHS.includes(location.pathname) ||
				location.pathname.startsWith('/api/auth')
			) {
				return
			}

			const session = await getSession()

			if (!session.data) {
				throw redirect({
					to: '/login',
					search: { redirect: location.href },
				})
			}
		},
		pendingComponent: LoadingPage,
		shellComponent: RootDocument,
	},
)

function RootDocument({ children }: { children: React.ReactNode }) {
	const { data: session } = useSession()
	const hasPreloadedSearchIndex = useRef(false)

	useEffect(() => {
		if (!session || hasPreloadedSearchIndex.current) return
		hasPreloadedSearchIndex.current = true

		preloadSearchIndex().catch(() => {})
	}, [session])

	return (
		<html lang='en'>
			<head>
				<meta charSet='UTF-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1.0' />
				<title>Duffle</title>
				<HeadContent />
			</head>
			<body className='text-typography-950'>
				<ThemeProvider>
					<TooltipProvider delay={300}>{children}</TooltipProvider>
				</ThemeProvider>
				<Scripts />
			</body>
		</html>
	)
}
