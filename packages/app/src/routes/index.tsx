import { createFileRoute } from '@tanstack/react-router'
import { KanbanBoard } from '@/components/kanban-board'
import { boards, useSampleData } from '@/state/sample-data'

export const App = () => {
	useSampleData()

	return (
		<main className='w-full h-full flex justify-center p-8'>
			<KanbanBoard id={boards[0]?.id!} />
		</main>
	)
}

export const Route = createFileRoute('/')({ component: App })
