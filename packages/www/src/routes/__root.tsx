import { createRootRoute, HeadContent, Scripts } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import '@/index.css'
import { LoadingPage } from '@/components/loading-page'
import { ThemeProvider } from '@/components/theme-provider'
import { TooltipProvider } from '@/components/tooltip'

export const Route = createRootRoute({
	pendingComponent: LoadingPage,
	shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
	// Collections load synchronously from localStorage on the client, but the
	// server renders with an empty in-memory fallback - gate on client mount
	// so the two don't mismatch.
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
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
						{mounted ? children : <LoadingPage />}
					</TooltipProvider>
				</ThemeProvider>
				<Scripts />
			</body>
		</html>
	)
}
