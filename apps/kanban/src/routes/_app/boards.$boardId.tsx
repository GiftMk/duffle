import { IconButton, TitleInput } from '@duffle/ui'
import { ICON_SIZE_MD } from '@duffle/utils/constants'
import { PencilSimpleIcon } from '@phosphor-icons/react'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { BoardNotFound } from '@/components/board-not-found'
import { KanbanBoard } from '@/components/kanban-board'
import { useBoard, useUpdateBoard } from '@/hooks/boards'
import {
	boardsCollection,
	columnsCollection,
	tasksCollection,
} from '@/lib/collections'
import type { BoardEntity } from '@/lib/schemas'

export const Route = createFileRoute('/_app/boards/$boardId')({
	component: RouteComponent,
	loader: () =>
		Promise.all([
			boardsCollection.preload(),
			columnsCollection.preload(),
			tasksCollection.preload(),
		]),
})

function RouteComponent() {
	const { boardId } = Route.useParams()
	const board = useBoard(boardId)

	if (!board) {
		return <BoardNotFound />
	}

	return (
		<div className='flex h-full w-full flex-col gap-6 px-8 py-4'>
			<BoardTitle board={board} />
			<KanbanBoard board={board} />
		</div>
	)
}

const BoardTitle = ({ board }: { board: BoardEntity }) => {
	const [isEditing, setIsEditing] = useState(false)
	const [title, setTitle] = useState(board.title)
	const updateBoard = useUpdateBoard()

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
			<h1 className='font-bold text-3xl tracking-tight'>{board.title}</h1>
			<IconButton
				onClick={startEditing}
				className='opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100'
			>
				<PencilSimpleIcon size={ICON_SIZE_MD} />
			</IconButton>
		</div>
	)
}
