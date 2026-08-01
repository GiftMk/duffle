import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { KanbanBoard } from '@/components/board/kanban-board'
import { BoardNotFound } from '@/components/board-not-found'
import { Sidebar } from '@/components/sidebar'
import { boardsStore } from '@/state/boards-store'
import { useBoard } from '@/hooks/boards'

export const Route = createFileRoute('/boards/$boardId')({
	component: RouteComponent,
})

function RouteComponent() {
	const { boardId } = Route.useParams()
	const board = useBoard(boardId)

	useEffect(() => {
		if (board) {
			boardsStore.trigger.setActive({ id: board.id })
		}
	}, [board])

	if (!board) {
		return <BoardNotFound />
	}

	return (
		<main className='flex h-full w-full bg-surface-100'>
			<Sidebar />
			<KanbanBoard />
		</main>
	)
}
