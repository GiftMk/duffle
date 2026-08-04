import { PencilSimpleIcon } from '@phosphor-icons/react'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { BoardNotFound } from '@/components/board-not-found'
import { KanbanBoard } from '@/components/boards/kanban-board'
import { IconButton } from '@/components/icon-button'
import { Sidebar } from '@/components/sidebar'
import { TitleInput } from '@/components/title-input'
import { useBoard } from '@/hooks/boards'
import { updateBoard } from '@/lib/actions'
import { ICON_SIZE_MD } from '@/lib/constants'
import { preferencesStore } from '@/state/preferences-store'
import type { BoardEntity } from '@duffle/api'

export const Route = createFileRoute('/boards/$boardId')({
	component: RouteComponent,
})

function RouteComponent() {
	const { boardId } = Route.useParams()
	const board = useBoard(boardId)

	useEffect(() => {
		if (board) {
			preferencesStore.trigger.setActive({ id: board.id })
		}
	}, [board])

	if (!board) {
		return <BoardNotFound />
	}

	return (
		<main className='flex h-full w-full bg-surface-100'>
			<Sidebar />
			<div className='flex h-full w-full flex-col gap-6 px-8 py-4'>
				<BoardTitle board={board} />
				<KanbanBoard board={board} />
			</div>
		</main>
	)
}

const BoardTitle = ({ board }: { board: BoardEntity }) => {
	const [isEditing, setIsEditing] = useState(false)
	const [title, setTitle] = useState(board.title)

	const startEditing = () => setIsEditing(true)

	const handleSubmit = (title: string) => {
		setIsEditing(false)
		updateBoard(board.id, (draft) => {
			draft.title = title
		})
	}

	const handleCancel = () => setIsEditing(false)

	if (isEditing) {
		return (
			<TitleInput
				value={title}
				onChange={setTitle}
				onSubmit={handleSubmit}
				onCancel={handleCancel}
				className='shrink-0 font-bold text-3xl tracking-tight'
			/>
		)
	}

	return (
		<div className='group flex shrink-0 items-center gap-2'>
			<h1 className='font-bold text-3xl text-typography-950 tracking-tight'>
				{board.title}
			</h1>
			<IconButton
				onClick={startEditing}
				className='opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100'
			>
				<PencilSimpleIcon size={ICON_SIZE_MD} />
			</IconButton>
		</div>
	)
}
