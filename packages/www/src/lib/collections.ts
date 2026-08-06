import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { createCollection } from '@tanstack/react-db'
import { QueryClient } from '@tanstack/react-query'
import { boardSchema, columnSchema, taskSchema } from '@/lib/schemas'
import {
	createBoard,
	deleteBoard,
	getBoards,
	updateBoard,
} from '@/server/boards'
import {
	createColumn,
	deleteColumn,
	getColumns,
	updateColumn,
} from '@/server/columns'
import { createTask, deleteTask, getTasks, updateTask } from '@/server/tasks'

export const queryClient = new QueryClient()

export const boardsCollection = createCollection(
	queryCollectionOptions({
		id: 'boards',
		queryClient,
		queryKey: ['boards'],
		getKey: (board) => board.id,
		schema: boardSchema,
		queryFn: () => getBoards(),
		onInsert: async ({ transaction }) => {
			await Promise.all(
				transaction.mutations.map((m) => createBoard({ data: m.modified })),
			)
		},
		onUpdate: async ({ transaction }) => {
			await Promise.all(
				transaction.mutations.map((m) => updateBoard({ data: m.modified })),
			)
		},
		onDelete: async ({ transaction }) => {
			await Promise.all(
				transaction.mutations.map((m) => deleteBoard({ data: { id: m.key } })),
			)
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
		queryFn: () => getColumns(),
		onInsert: async ({ transaction }) => {
			await Promise.all(
				transaction.mutations.map((m) => createColumn({ data: m.modified })),
			)
		},
		onUpdate: async ({ transaction }) => {
			await Promise.all(
				transaction.mutations.map((m) => updateColumn({ data: m.modified })),
			)
		},
		onDelete: async ({ transaction }) => {
			await Promise.all(
				transaction.mutations.map((m) => deleteColumn({ data: { id: m.key } })),
			)
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
		queryFn: () => getTasks(),
		onInsert: async ({ transaction }) => {
			await Promise.all(
				transaction.mutations.map((m) => createTask({ data: m.modified })),
			)
		},
		onUpdate: async ({ transaction }) => {
			await Promise.all(
				transaction.mutations.map((m) => updateTask({ data: m.modified })),
			)
		},
		onDelete: async ({ transaction }) => {
			await Promise.all(
				transaction.mutations.map((m) => deleteTask({ data: { id: m.key } })),
			)
		},
	}),
)
