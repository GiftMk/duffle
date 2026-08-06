import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { createCollection } from '@tanstack/react-db'
import { QueryClient } from '@tanstack/react-query'
import { boardSchema, columnSchema, taskSchema } from '@/lib/schemas'
import {
	boardRepository,
	columnRepository,
	taskRepository,
} from './repositories'

export const queryClient = new QueryClient()

export const boardsCollection = createCollection(
	queryCollectionOptions({
		id: 'boards',
		queryClient,
		queryKey: ['boards'],
		getKey: (board) => board.id,
		schema: boardSchema,
		queryFn: () => boardRepository.getAll(),
		onInsert: async ({ transaction }) => {
			const { modified } = transaction.mutations[0]
			await boardRepository.add(modified)
		},
		onUpdate: async ({ transaction }) => {
			const { modified } = transaction.mutations[0]
			await boardRepository.update(modified)
		},
		onDelete: async ({ transaction }) => {
			const { key: id } = transaction.mutations[0]
			await boardRepository.delete(id)
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
		queryFn: () => columnRepository.getAll(),
		onInsert: async ({ transaction }) => {
			const { modified } = transaction.mutations[0]
			await columnRepository.add(modified)
		},
		onUpdate: async ({ transaction }) => {
			const { modified } = transaction.mutations[0]
			await columnRepository.update(modified)
		},
		onDelete: async ({ transaction }) => {
			const { key: id } = transaction.mutations[0]
			await columnRepository.delete(id)
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
		queryFn: () => taskRepository.getAll(),
		onInsert: async ({ transaction }) => {
			const { modified } = transaction.mutations[0]
			await taskRepository.add(modified)
		},
		onUpdate: async ({ transaction }) => {
			const { modified } = transaction.mutations[0]
			await taskRepository.update(modified)
		},
		onDelete: async ({ transaction }) => {
			const { key: id } = transaction.mutations[0]
			await taskRepository.delete(id)
		},
	}),
)
