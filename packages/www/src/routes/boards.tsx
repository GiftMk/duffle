import { createFileRoute } from '@tanstack/react-router'
import { AddBoardCard } from '@/components/boards/add-board-card'
import { BoardCard } from '@/components/boards/board-card'
import { Sidebar } from '@/components/sidebar'
import { useBoards } from '@/hooks/boards'

export const Route = createFileRoute('/boards')({
	component: RouteComponent,
})

function RouteComponent() {
	const boards = useBoards()
	const sortedBoards = [...boards].sort((a, b) =>
		b.createdAt.localeCompare(a.createdAt),
	)

	return (
		<main className='flex h-full w-full bg-surface-100'>
			<Sidebar />
			<div className='h-full w-full overflow-y-auto p-8'>
				<h1 className='font-bold text-3xl text-typography-950 tracking-tight'>
					Boards
				</h1>
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
