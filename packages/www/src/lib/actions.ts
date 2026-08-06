import { createOptimisticAction } from '@tanstack/react-db'
import { uuidv7 } from 'uuidv7'
import {
	boardsCollection,
	columnsCollection,
	tasksCollection,
} from '@/lib/collections'
import type { BoardEntity, ColumnEntity, TaskEntity } from '@/lib/schemas'
import { utcNow } from '@/lib/utils'
import { createBoard as createBoardFn } from '@/server/boards'
import { createColumn as createColumnFn } from '@/server/columns'

export const updateBoard = (
	id: string,
	recipe: (draft: Omit<BoardEntity, 'columns'>) => void,
) => {
	boardsCollection.update(id, (draft) => {
		recipe(draft)
		draft.updatedAt = utcNow()
	})
}

export const deleteBoard = (id: string) => {
	boardsCollection.delete(id)
}

export const updateColumn = (
	id: string,
	recipe: (draft: ColumnEntity) => void,
) => {
	columnsCollection.update(id, (draft) => {
		recipe(draft)
		draft.updatedAt = utcNow()
	})
}

export const deleteColumn = (id: string) => {
	columnsCollection.delete(id)
}

export const updateTask = (id: string, recipe: (draft: TaskEntity) => void) => {
	const task = tasksCollection.get(id)

	if (!task) {
		throw new Error(`Task with id '${id}' not found`)
	}

	tasksCollection.update(id, (draft) => {
		recipe(draft)
		draft.updatedAt = utcNow()
	})
}

export const deleteTask = (id: string) => {
	const task = tasksCollection.get(id)

	if (!task) {
		throw new Error(`Task with id '${id}' not found`)
	}

	tasksCollection.delete(id)
}

export const addTask = (
	columnId: string,
	title: string,
	description?: string,
) => {
	const timestamp = utcNow()
	const lastTask = tasksCollection.toArray
		.filter((task) => task.columnId === columnId)
		.sort((a, b) => a.position - b.position)
		.at(-1)
	const position = lastTask === undefined ? 0 : lastTask.position + 1

	const task: TaskEntity = {
		id: uuidv7(),
		columnId,
		title,
		description,
		createdAt: timestamp,
		updatedAt: timestamp,
		position,
	}

	tasksCollection.insert(task)
}

const updateTaskPositions = (columnId: string, tasks: TaskEntity[]) => {
	for (const [i, task] of tasks.entries()) {
		tasksCollection.update(task.id, (draft) => {
			draft.columnId = columnId
			draft.position = i
			draft.updatedAt = utcNow()
		})
	}
}

const getSortedTasks = (columnId: string, tasks: TaskEntity[]) => {
	return tasks
		.filter((t) => t.columnId === columnId)
		.sort((a, b) => a.position - b.position)
}

type DndTarget = Pick<TaskEntity, 'position' | 'columnId'>

export const moveTask = (source: DndTarget, destination: DndTarget) => {
	const tasks = tasksCollection.toArray
	const sourceTasks = getSortedTasks(source.columnId, tasks)
	const sourceTask = sourceTasks[source.position]

	if (!sourceTask) {
		throw new Error(`Failed to move task, could not find source task.`)
	}

	if (source.columnId === destination.columnId) {
		sourceTasks.splice(source.position, 1)
		sourceTasks.splice(destination.position, 0, sourceTask)
		updateTaskPositions(source.columnId, sourceTasks)

		return
	}

	sourceTasks.splice(source.position, 1)
	updateTaskPositions(source.columnId, sourceTasks)

	const destinationTasks = getSortedTasks(destination.columnId, tasks)
	destinationTasks.splice(destination.position, 0, sourceTask)
	updateTaskPositions(destination.columnId, destinationTasks)
}

type CreateBoardVars = { board: BoardEntity; columns: ColumnEntity[] }

const createBoardAction = createOptimisticAction<CreateBoardVars>({
	onMutate: ({ board, columns }) => {
		boardsCollection.insert(board)
		columnsCollection.insert(columns)
	},
	mutationFn: async ({ board, columns }) => {
		await createBoardFn({ data: board })
		await Promise.all(columns.map((column) => createColumnFn({ data: column })))

		await Promise.all([
			boardsCollection.utils.refetch(),
			columnsCollection.utils.refetch(),
		])
	},
})

export const createBoard = (title: string) => {
	const timestamp = utcNow()

	const board: BoardEntity = {
		id: uuidv7(),
		title,
		createdAt: timestamp,
		updatedAt: timestamp,
	}

	const columns: ColumnEntity[] = ['Todo', 'In Progress', 'Done'].map(
		(title, i) => ({
			id: uuidv7(),
			boardId: board.id,
			position: i,
			title,
			createdAt: timestamp,
			updatedAt: timestamp,
		}),
	)

	createBoardAction({ board, columns })

	return board
}
