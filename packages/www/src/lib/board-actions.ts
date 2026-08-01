import { uuidv7 } from 'uuidv7'
import { type TaskEntity, type ColumnEntity, db } from './db'

const SEED_COLUMNS: Array<{ title: string; cards: string[] }> = [
	{
		title: 'Todo',
		cards: ['Sketch out the board layout', 'Pick a name for v2'],
	},
	{ title: 'In Progress', cards: ['Port drag and drop from v0'] },
	{ title: 'Done', cards: ['Ship the markdown editor'] },
]

export const seedBoardIfEmpty = async () => {
	await db.transaction('rw', db.columns, db.tasks, async () => {
		const existing = await db.columns.count()
		if (existing > 0) return

		for (const [order, column] of SEED_COLUMNS.entries()) {
			const cardIds: string[] = []

			for (const title of column.cards) {
				const task: TaskEntity = {
					id: uuidv7(),
					title,
					createdAt: new Date().toISOString(),
				}
				await db.tasks.add(task)
				cardIds.push(task.id)
			}

			const boardColumn: ColumnEntity = {
				id: uuidv7(),
				title: column.title,
				order,
				cardIds,
			}
			await db.columns.add(boardColumn)
		}
	})
}

export const buildCard = (title: string, description?: string): TaskEntity => ({
	id: uuidv7(),
	title,
	...(description ? { description } : {}),
	createdAt: new Date().toISOString(),
})

export const persistCard = async (columnId: string, task: TaskEntity) => {
	await db.transaction('rw', db.columns, db.tasks, async () => {
		await db.tasks.add(task)
		await db.columns
			.where('id')
			.equals(columnId)
			.modify((column) => {
				column.cardIds.push(task.id)
			})
	})
}

export const persistColumnOrder = async (
	columns: Pick<ColumnEntity, 'id' | 'cardIds'>[],
) => {
	await db.transaction('rw', db.columns, async () => {
		for (const column of columns) {
			await db.columns.update(column.id, { cardIds: column.cardIds })
		}
	})
}

export const renameColumn = async (columnId: string, title: string) => {
	await db.columns.update(columnId, { title })
}
