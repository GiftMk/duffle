import { createRootRoute, HeadContent, Scripts } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import '@/index.css'
import { LoadingPage } from '@/components/loading-page'
import { ThemeProvider } from '@/components/theme-provider'
import { TooltipProvider } from '@/components/tooltip'
import { hydrateStores } from '@/state/hydrate'

export const Route = createRootRoute({
	pendingComponent: LoadingPage,
	shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
	const [hydrated, setHydrated] = useState(false)

	useEffect(() => {
		hydrateStores().then(() => setHydrated(true))
	}, [])

	return (
		<html lang='en'>
			<head>
				<meta charSet='UTF-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1.0' />
				<title>Duffle</title>
				<HeadContent />
			</head>
			<body>
				<ThemeProvider>
					<TooltipProvider delay={300}>
						{hydrated ? children : <LoadingPage />}
					</TooltipProvider>
				</ThemeProvider>
				<Scripts />
			</body>
		</html>
	)
}
