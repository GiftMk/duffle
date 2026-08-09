import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { createCollection } from '@tanstack/react-db'
import { QueryClient } from '@tanstack/react-query'
import {
	boardSchema,
	columnSchema,
	noteSchema,
	taskSchema,
} from '@/lib/schemas'
import {
	createBoardFn,
	deleteBoardFn,
	getBoardsFn,
	updateBoardFn,
} from '@/server/boards'
import {
	createColumnFn,
	deleteColumnFn,
	getColumnsFn,
	updateColumnFn,
} from '@/server/columns'
import {
	createNoteFn,
	deleteNoteFn,
	getNotesFn,
	updateNoteFn,
} from '@/server/notes'
import {
	createTaskFn,
	deleteTaskFn,
	getTasksFn,
	updateTaskFn,
} from '@/server/tasks'

export const queryClient = new QueryClient()

export const boardsCollection = createCollection(
	queryCollectionOptions({
		id: 'boards',
		queryClient,
		queryKey: ['boards'],
		getKey: (board) => board.id,
		schema: boardSchema,
		queryFn: () => getBoardsFn(),
		onInsert: async ({ transaction }) => {
			const { modified } = transaction.mutations[0]
			await createBoardFn({ data: modified })
		},
		onUpdate: async ({ transaction }) => {
			const { modified } = transaction.mutations[0]
			await updateBoardFn({ data: modified })
		},
		onDelete: async ({ transaction }) => {
			const { key: id } = transaction.mutations[0]
			await deleteBoardFn({ data: { id } })
		},
	}),
)

export const columnsCollection = createCollection(
	queryCollectionOptions({
		id: 'columns',
		queryClient,
		queryKey: ['columns'],
		getKey: (column) => column.id,
		schema: columnSchema,
		queryFn: () => getColumnsFn(),
		onInsert: async ({ transaction }) => {
			const { modified } = transaction.mutations[0]
			await createColumnFn({ data: modified })
		},
		onUpdate: async ({ transaction }) => {
			const { modified } = transaction.mutations[0]
			await updateColumnFn({ data: modified })
		},
		onDelete: async ({ transaction }) => {
			const { key: id } = transaction.mutations[0]
			await deleteColumnFn({ data: { id } })
		},
	}),
)

export const tasksCollection = createCollection(
	queryCollectionOptions({
		id: 'tasks',
		queryClient,
		queryKey: ['tasks'],
		getKey: (task) => task.id,
		schema: taskSchema,
		queryFn: () => getTasksFn(),
		onInsert: async ({ transaction }) => {
			const { modified } = transaction.mutations[0]
			await createTaskFn({ data: modified })
		},
		onUpdate: async ({ transaction }) => {
			const { modified } = transaction.mutations[0]
			await updateTaskFn({ data: modified })
		},
		onDelete: async ({ transaction }) => {
			const { key: id } = transaction.mutations[0]
			await deleteTaskFn({ data: { id } })
		},
	}),
)

export const notesCollection = createCollection(
	queryCollectionOptions({
		id: 'notes',
		queryClient,
		queryKey: ['notes'],
		getKey: (note) => note.id,
		schema: noteSchema,
		queryFn: () => getNotesFn(),
		onInsert: async ({ transaction }) => {
			const { modified } = transaction.mutations[0]
			await createNoteFn({ data: modified })
		},
		onUpdate: async ({ transaction }) => {
			const { modified } = transaction.mutations[0]
			await updateNoteFn({ data: modified })
		},
		onDelete: async ({ transaction }) => {
			const { key: id } = transaction.mutations[0]
			await deleteNoteFn({ data: { id } })
		},
	}),
)
