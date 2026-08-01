import { uuidv7 } from 'uuidv7'
import { type BoardCard, type BoardColumn, db } from './db'

const SEED_COLUMNS: Array<{ title: string; cards: string[] }> = [
	{
		title: 'Todo',
		cards: ['Sketch out the board layout', 'Pick a name for v2'],
	},
	{ title: 'In Progress', cards: ['Port drag and drop from v0'] },
	{ title: 'Done', cards: ['Ship the markdown editor'] },
]

export const seedBoardIfEmpty = async () => {
	await db.transaction('rw', db.boardColumns, db.boardCards, async () => {
		const existing = await db.boardColumns.count()
		if (existing > 0) return

		for (const [order, column] of SEED_COLUMNS.entries()) {
			const cardIds: string[] = []

			for (const title of column.cards) {
				const card: BoardCard = {
					id: uuidv7(),
					title,
					createdAt: new Date().toISOString(),
				}
				await db.boardCards.add(card)
				cardIds.push(card.id)
			}

			const boardColumn: BoardColumn = {
				id: uuidv7(),
				title: column.title,
				order,
				cardIds,
			}
			await db.boardColumns.add(boardColumn)
		}
	})
}

export const buildCard = (title: string, description?: string): BoardCard => ({
	id: uuidv7(),
	title,
	...(description ? { description } : {}),
	createdAt: new Date().toISOString(),
})

export const persistCard = async (columnId: string, card: BoardCard) => {
	await db.transaction('rw', db.boardColumns, db.boardCards, async () => {
		await db.boardCards.add(card)
		await db.boardColumns
			.where('id')
			.equals(columnId)
			.modify((column) => {
				column.cardIds.push(card.id)
			})
	})
}

export const persistColumnOrder = async (
	columns: Pick<BoardColumn, 'id' | 'cardIds'>[],
) => {
	await db.transaction('rw', db.boardColumns, async () => {
		for (const column of columns) {
			await db.boardColumns.update(column.id, { cardIds: column.cardIds })
		}
	})
}

export const renameColumn = async (columnId: string, title: string) => {
	await db.boardColumns.update(columnId, { title })
}
