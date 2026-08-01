import { produce } from 'immer'
import { uuidv7 } from 'uuidv7'
import { defaultBoardConfig } from '@/lib/default-board'
import { type BoardEntity, boardsStore } from '@/state/boards-store'
import { type ColumnEntity, columnsStore } from '@/state/columns-store'
import { type TaskEntity, tasksStore } from '@/state/tasks-store'

export const updateBoard = (
	id: string,
	recipe: (draft: Omit<BoardEntity, 'columns'>) => void,
) => {
	const board = boardsStore.get().context.boards[id]

	if (!board) {
		throw new Error(`Board with id '${id}' not found`)
	}

	const updatedBoard = produce(board, recipe)

	if (board === updatedBoard) {
		return
	}

	boardsStore.trigger.update({ board: updatedBoard })
}

export const updateColumn = (
	id: string,
	recipe: (draft: Omit<ColumnEntity, 'tasks'>) => void,
) => {
	const column = columnsStore.get().context.columns[id]

	if (!column) {
		throw new Error(`Column with id '${id}' not found`)
	}

	const updatedColumn = produce(column, recipe)

	if (column === updatedColumn) {
		return
	}

	columnsStore.trigger.update({ column: updatedColumn })
}

export const updateTask = (id: string, recipe: (draft: TaskEntity) => void) => {
	const task = tasksStore.get().context.tasks[id]

	if (!task) {
		throw new Error(`Task with id '${id}' not found`)
	}

	const updatedTask = produce(task, recipe)

	if (task === updatedTask) {
		return
	}

	tasksStore.trigger.update({ task: updatedTask })
}

export const addTask = (
	columnId: string,
	title: string,
	description?: string,
) => {
	const task: Omit<TaskEntity, 'createdAt' | 'updatedAt'> = {
		id: uuidv7(),
		title,
		description,
	}

	const column = columnsStore.get().context.columns[columnId]
	if (!column) {
		throw new Error(
			`Failed to add task. Column with id '${columnId}' not found.`,
		)
	}

	const updatedColumn = produce(column, (draft) => {
		draft.tasks.push(task.id)
	})

	tasksStore.trigger.add({ task })
	columnsStore.trigger.update({ column: updatedColumn })
}

type CardPosition = {
	columnId: string
	taskIndex: number
}

const getColumn = (id: string) => {
	const column = columnsStore.get().context.columns[id]
	if (!column) {
		throw new Error(`Column with id '${id}' not found`)
	}

	return column
}

export const moveCard = (source: CardPosition, destination: CardPosition) => {
	const sourceColumn = getColumn(source.columnId)

	const sourceTaskId = sourceColumn.tasks[source.taskIndex]
	if (sourceTaskId === undefined) {
		throw new Error(
			`No task at index ${source.taskIndex} in column '${source.columnId}'`,
		)
	}

	if (source.columnId === destination.columnId) {
		const updatedColumn = produce(sourceColumn, (draft) => {
			draft.tasks.splice(source.taskIndex, 1)
			draft.tasks.splice(destination.taskIndex, 0, sourceTaskId)
		})
		columnsStore.trigger.update({ column: updatedColumn })
		return
	}

	const updatedSourceColumn = produce(sourceColumn, (draft) => {
		draft.tasks.splice(source.taskIndex, 1)
	})

	const destinationColumn = getColumn(destination.columnId)
	const updatedDestinationColumn = produce(destinationColumn, (draft) => {
		draft.tasks.splice(destination.taskIndex, 0, sourceTaskId)
	})

	columnsStore.trigger.update({ column: updatedSourceColumn })
	columnsStore.trigger.update({ column: updatedDestinationColumn })
}

export const createDefaultBoard = () => {
	const columns: Omit<ColumnEntity, 'createdAt' | 'updatedAt'>[] =
		defaultBoardConfig.columns.map((column) => {
			const tasks: Omit<TaskEntity, 'createdAt' | 'updatedAt'>[] =
				column.tasks.map((title) => ({
					id: uuidv7(),
					title,
				}))

			for (const task of tasks) {
				tasksStore.trigger.add({ task })
			}

			return {
				id: uuidv7(),
				title: column.title,
				tasks: tasks.map((task) => task.id),
			}
		})

	for (const column of columns) {
		columnsStore.trigger.add({ column })
	}

	const board: Omit<BoardEntity, 'createdAt' | 'updatedAt'> = {
		id: uuidv7(),
		title: defaultBoardConfig.title,
		columns: columns.map((column) => column.id),
	}

	boardsStore.trigger.add({ board })
	boardsStore.trigger.setActive({ id: board.id })

	return board
}
