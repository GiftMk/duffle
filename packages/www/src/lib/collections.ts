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
import { createNote, getNotes, updateNote } from '@/server/notes'
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
			const { modified } = transaction.mutations[0]
			await createBoard({ data: modified })
		},
		onUpdate: async ({ transaction }) => {
			const { modified } = transaction.mutations[0]
			await updateBoard({ data: modified })
		},
		onDelete: async ({ transaction }) => {
			const { key: id } = transaction.mutations[0]
			await deleteBoard({ data: { id } })
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
			const { modified } = transaction.mutations[0]
			await createColumn({ data: modified })
		},
		onUpdate: async ({ transaction }) => {
			const { modified } = transaction.mutations[0]
			await updateColumn({ data: modified })
		},
		onDelete: async ({ transaction }) => {
			const { key: id } = transaction.mutations[0]
			await deleteColumn({ data: { id } })
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
			const { modified } = transaction.mutations[0]
			await createTask({ data: modified })
		},
		onUpdate: async ({ transaction }) => {
			const { modified } = transaction.mutations[0]
			await updateTask({ data: modified })
		},
		onDelete: async ({ transaction }) => {
			const { key: id } = transaction.mutations[0]
			await deleteTask({ data: { id } })
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
		queryFn: () => getNotes(),
		onInsert: async ({ transaction }) => {
			const { modified } = transaction.mutations[0]
			await createNote({ data: modified })
		},
		onUpdate: async ({ transaction }) => {
			const { modified } = transaction.mutations[0]
			await updateNote({ data: modified })
		},
	}),
)
