import {
	createCollection,
	localStorageCollectionOptions,
} from '@tanstack/react-db'
import { boardSchema, columnSchema, taskSchema } from '@duffle/api'

export const boardsCollection = createCollection(
	localStorageCollectionOptions({
		id: 'boards',
		storageKey: 'duffle-boards',
		getKey: (board) => board.id,
		schema: boardSchema,
	}),
)

export const columnsCollection = createCollection(
	localStorageCollectionOptions({
		id: 'columns',
		storageKey: 'duffle-columns',
		getKey: (column) => column.id,
		schema: columnSchema,
	}),
)

export const tasksCollection = createCollection(
	localStorageCollectionOptions({
		id: 'tasks',
		storageKey: 'duffle-tasks',
		getKey: (task) => task.id,
		schema: taskSchema,
	}),
)
