import type { QueryClient } from '@tanstack/react-query'
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from '@tanstack/react-router'
import '@/index.css'
import { LoadingPage } from '@/components/loading-page'
import { ThemeProvider } from '@/components/sidebar/theme-provider'
import { TooltipProvider } from '@/components/tooltip'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
	pendingComponent: LoadingPage,
	shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
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
