import { uuidv7 } from 'uuidv7'
import { type ColumnEntity, db, type TaskEntity } from './db'

const SEED_COLUMNS: Array<{ title: string; tasks: string[] }> = [
	{
		title: 'Todo',
		tasks: ['Sketch out the board layout', 'Pick a name for v2'],
	},
	{ title: 'In Progress', tasks: ['Port drag and drop from v0'] },
	{ title: 'Done', tasks: ['Ship the markdown editor'] },
]

export const seedBoardIfEmpty = async () => {
	await db.transaction('rw', db.columns, db.tasks, async () => {
		const existing = await db.columns.count()
		if (existing > 0) return

		for (const [order, column] of SEED_COLUMNS.entries()) {
			const taskIds: string[] = []

			for (const title of column.tasks) {
				const task: TaskEntity = {
					id: uuidv7(),
					title,
					createdAt: new Date().toISOString(),
				}
				await db.tasks.add(task)
				taskIds.push(task.id)
			}

			const boardColumn: ColumnEntity = {
				id: uuidv7(),
				title: column.title,
				order,
				cardIds: taskIds,
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
