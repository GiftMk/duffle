import { createFileRoute } from '@tanstack/react-router'
import { AddBoardCard } from '@/components/kanban/add-board-card'
import { BoardCard } from '@/components/kanban/board-card'
import { Sidebar } from '@/components/sidebar'
import { useBoards } from '@/hooks/boards'
import { boardsCollection } from '@/lib/collections'

export const Route = createFileRoute('/boards/')({
	component: RouteComponent,
	loader: () => boardsCollection.preload(),
})

function RouteComponent() {
	const boards = useBoards()
	const sortedBoards = [...boards].sort((a, b) =>
		b.createdAt.localeCompare(a.createdAt),
	)

	return (
		<main className='flex h-full w-full bg-surface-100'>
			<Sidebar />
			<div className='h-full w-full overflow-y-auto px-8 py-4'>
				<h1 className='font-bold text-3xl tracking-tight'>Boards</h1>
				<div className='mt-8 flex flex-wrap gap-6'>
					<AddBoardCard />
					{sortedBoards.map((board) => (
						<BoardCard key={board.id} board={board} />
					))}
				</div>
			</div>
		</main>
	)
}
