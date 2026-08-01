import { createFileRoute } from '@tanstack/react-router'
import { KanbanBoard } from '@/components/board/kanban-board'
import { Sidebar } from '@/components/sidebar'

export const Route = createFileRoute('/board')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<main className='flex h-full w-full bg-surface-100'>
			<Sidebar />
			<KanbanBoard />
		</main>
	)
}
