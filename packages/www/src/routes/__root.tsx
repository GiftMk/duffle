import { createRootRoute, HeadContent, Scripts } from '@tanstack/react-router'
import { useEffect } from 'react'
import '@/index.css'
import { LoadingPage } from '@/components/loading-page'
import { ThemeProvider } from '@/components/theme-provider'
import { TooltipProvider } from '@/components/tooltip'
import { db } from '@/lib/db'
import { searchWorker } from '@/workers/search'

export const Route = createRootRoute({
	pendingComponent: LoadingPage,
	shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		db.notes.toArray().then(async (notes) => {
			await searchWorker.add(notes)
		})
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
					<TooltipProvider delay={300}>{children}</TooltipProvider>
				</ThemeProvider>
				<Scripts />
			</body>
		</html>
	)
}
