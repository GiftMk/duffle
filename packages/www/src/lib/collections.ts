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
import { getSession } from '@/server/session.server'
import { createTask, deleteTask, getTasks, updateTask } from '@/server/tasks'
import { LocalEntityStore } from './local-storage'

export const queryClient = new QueryClient()

const isAnonymous = async () => {
	const session = await getSession()
	return session?.user === undefined
}

export const localBoards = new LocalEntityStore('boards', boardSchema)

export const boardsCollection = createCollection(
	queryCollectionOptions({
		id: 'boards',
		queryClient,
		queryKey: ['boards'],
		getKey: (board) => board.id,
		schema: boardSchema,
		queryFn: async () => {
			if (await isAnonymous()) {
				return localBoards.getAll()
			}

			return getBoards()
		},
		onInsert: async ({ transaction }) => {
			const { modified } = transaction.mutations[0]

			if (await isAnonymous()) {
				localBoards.add(modified)
			}

			await createBoard({ data: modified })
		},
		onUpdate: async ({ transaction }) => {
			const { modified } = transaction.mutations[0]

			if (await isAnonymous()) {
				localBoards.update(modified)
			}

			await updateBoard({ data: modified })
		},
		onDelete: async ({ transaction }) => {
			const { key: id } = transaction.mutations[0]

			if (await isAnonymous()) {
				localBoards.delete(id)
			}

			await deleteBoard({ data: { id } })
		},
	}),
)

const localColumns = new LocalEntityStore('columns', columnSchema)

export const columnsCollection = createCollection(
	queryCollectionOptions({
		id: 'columns',
		queryClient,
		queryKey: ['columns'],
		getKey: (column) => column.id,
		schema: columnSchema,
		queryFn: async () => {
			if (await isAnonymous()) {
				return localColumns.getAll()
			}

			return await getColumns()
		},
		onInsert: async ({ transaction }) => {
			const { modified } = transaction.mutations[0]

			if (await isAnonymous()) {
				localColumns.add(modified)
			}

			await createColumn({ data: modified })
		},
		onUpdate: async ({ transaction }) => {
			const { modified } = transaction.mutations[0]

			if (await isAnonymous()) {
				localColumns.update(modified)
			}

			await updateColumn({ data: modified })
		},
		onDelete: async ({ transaction }) => {
			const { key: id } = transaction.mutations[0]

			if (await isAnonymous()) {
				localColumns.delete(id)
			}

			await deleteColumn({ data: { id } })
		},
	}),
)

const localTasks = new LocalEntityStore('tasks', taskSchema)

export const tasksCollection = createCollection(
	queryCollectionOptions({
		id: 'tasks',
		queryClient,
		queryKey: ['tasks'],
		getKey: (task) => task.id,
		schema: taskSchema,
		queryFn: async () => {
			if (await isAnonymous()) {
				return localTasks.getAll()
			}

			return await getTasks()
		},
		onInsert: async ({ transaction }) => {
			const { modified } = transaction.mutations[0]

			if (await isAnonymous()) {
				localTasks.add(modified)
			}

			await createTask({ data: modified })
		},
		onUpdate: async ({ transaction }) => {
			const { modified } = transaction.mutations[0]

			if (await isAnonymous()) {
				localTasks.update(modified)
			}

			await updateTask({ data: modified })
		},
		onDelete: async ({ transaction }) => {
			const { key: id } = transaction.mutations[0]

			if (await isAnonymous()) {
				localTasks.delete(id)
			}

			await deleteTask({ data: { id } })
		},
	}),
)
