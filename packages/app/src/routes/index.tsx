import { createFileRoute } from '@tanstack/react-router'
import { KanbanBoard } from '@/components/kanban-board'
import { boards, useSampleData } from '@/state/sample-data'

export const App = () => {
	useSampleData()

	return (
		<main className='flex h-full w-full justify-center'>
			{/** biome-ignore lint/style/noNonNullAssertion: dont care right now */}
			{/** biome-ignore lint/suspicious/noNonNullAssertedOptionalChain: no. care */}
			<KanbanBoard id={boards[0]?.id!} />
		</main>
	)
}

export const Route = createFileRoute('/')({ component: App, ssr: false })
