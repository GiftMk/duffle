import { useEffect, useState } from 'react'
import {
	buildCard,
	persistCard,
	persistColumnOrder,
	renameColumn as renameColumnAction,
	seedBoardIfEmpty,
} from '@/lib/board-actions'
import { type BoardCard, type BoardColumn, db } from '@/lib/db'
import { searchWorker } from '@/workers/search'

export type DragPosition = {
	columnId: string
	index: number
}

export const useBoard = () => {
	const [columns, setColumns] = useState<BoardColumn[]>([])
	const [cards, setCards] = useState<Record<string, BoardCard>>({})
	const [ready, setReady] = useState(false)

	useEffect(() => {
		let cancelled = false

		const load = async () => {
			await seedBoardIfEmpty()
			const [loadedColumns, loadedCards] = await Promise.all([
				db.boardColumns.orderBy('order').toArray(),
				db.boardCards.toArray(),
			])

			if (cancelled) return

			setColumns(loadedColumns)
			setCards(Object.fromEntries(loadedCards.map((card) => [card.id, card])))
			setReady(true)

			await searchWorker.clear()
			await searchWorker.add(
				loadedCards.map(({ id, title }) => ({ id, title })),
			)
		}

		load()

		return () => {
			cancelled = true
		}
	}, [])

	const addCard = (columnId: string, title: string, description?: string) => {
		const trimmed = title.trim()
		if (!trimmed) return

		const card = buildCard(trimmed, description)

		setCards((prev) => ({ ...prev, [card.id]: card }))
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

	return { columns, cards, ready, addCard, moveCard, renameColumn }
}
