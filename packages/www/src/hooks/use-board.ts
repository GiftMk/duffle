import { useEffect, useState } from 'react'
import {
	buildCard,
	persistCard,
	persistColumnOrder,
	renameColumn as renameColumnAction,
	seedBoardIfEmpty,
} from '@/lib/board-actions'
import { type ColumnEntity, db, type TaskEntity } from '@/lib/db'
import { searchWorker } from '@/workers/search'

export type DragPosition = {
	columnId: string
	index: number
}

export const useBoard = () => {
	const [columns, setColumns] = useState<ColumnEntity[]>([])
	const [tasks, setTasks] = useState<Record<string, TaskEntity>>({})
	const [ready, setReady] = useState(false)

	useEffect(() => {
		let cancelled = false

		const load = async () => {
			await seedBoardIfEmpty()
			const [loadedColumns, loadedTasks] = await Promise.all([
				db.columns.orderBy('order').toArray(),
				db.tasks.toArray(),
			])

			if (cancelled) return

			setColumns(loadedColumns)
			setTasks(Object.fromEntries(loadedTasks.map((card) => [card.id, card])))
			setReady(true)

			await searchWorker.clear()
			await searchWorker.add(
				loadedTasks.map(({ id, title }) => ({ id, title })),
			)
		}

		load()

		return () => {
			cancelled = true
		}
	}, [])

	const addTask = (columnId: string, title: string, description?: string) => {
		const trimmed = title.trim()
		if (!trimmed) return

		const card = buildCard(trimmed, description)

		setTasks((prev) => ({ ...prev, [card.id]: card }))
		setColumns((prev) =>
			prev.map((column) =>
				column.id === columnId
					? { ...column, cardIds: [...column.cardIds, card.id] }
					: column,
			),
		)

		persistCard(columnId, card)
		searchWorker.add([{ id: card.id, title: card.title }])
	}

	const moveCard = (source: DragPosition, destination: DragPosition) => {
		setColumns((prev) => {
			const next = prev.map((column) => ({
				...column,
				cardIds: [...column.cardIds],
			}))
			const sourceColumn = next.find((column) => column.id === source.columnId)
			const destinationColumn = next.find(
				(column) => column.id === destination.columnId,
			)
			if (!sourceColumn || !destinationColumn) return prev

			const [movedCardId] = sourceColumn.cardIds.splice(source.index, 1)
			if (!movedCardId) return prev
			destinationColumn.cardIds.splice(destination.index, 0, movedCardId)

			const changedColumns =
				sourceColumn.id === destinationColumn.id
					? [sourceColumn]
					: [sourceColumn, destinationColumn]
			persistColumnOrder(changedColumns)

			return next
		})
	}

	const renameColumn = (columnId: string, title: string) => {
		setColumns((prev) =>
			prev.map((column) =>
				column.id === columnId ? { ...column, title } : column,
			),
		)

		renameColumnAction(columnId, title)
	}

	return {
		columns,
		tasks,
		ready,
		addTask,
		moveCard,
		renameColumn,
	}
}
