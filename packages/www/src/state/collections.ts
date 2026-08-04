import { boardSchema, columnSchema, taskSchema } from '@duffle/api'
import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { createCollection } from '@tanstack/react-db'
import { client } from '@/lib/api'
import { queryClient } from '@/lib/query-client'

export const boardsCollection = createCollection(
	queryCollectionOptions({
		id: 'boards',
		queryClient,
		queryKey: ['boards'],
		getKey: (board) => board.id,
		schema: boardSchema,
		queryFn: async () => {
			const res = await client.api.boards.$get()
			if (!res.ok) throw new Error('Failed to fetch boards')
			return res.json()
		},
		onInsert: async ({ transaction }) => {
			await Promise.all(
				transaction.mutations.map((m) =>
					client.api.boards.create.$post({ json: m.modified }),
				),
			)
		},
		onUpdate: async ({ transaction }) => {
			await Promise.all(
				transaction.mutations.map((m) =>
					client.api.boards.update.$put({ json: m.modified }),
				),
			)
		},
		onDelete: async ({ transaction }) => {
			await Promise.all(
				transaction.mutations.map((m) =>
					client.api.boards.delete.$delete({ json: { id: m.key } }),
				),
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
		queryFn: async () => {
			const res = await client.api.columns.$get()
			if (!res.ok) throw new Error('Failed to fetch columns')
			return res.json()
		},
		onInsert: async ({ transaction }) => {
			await Promise.all(
				transaction.mutations.map((m) =>
					client.api.columns.create.$post({ json: m.modified }),
				),
			)
		},
		onUpdate: async ({ transaction }) => {
			await Promise.all(
				transaction.mutations.map((m) =>
					client.api.columns.update.$put({ json: m.modified }),
				),
			)
		},
		onDelete: async ({ transaction }) => {
			await Promise.all(
				transaction.mutations.map((m) =>
					client.api.columns.delete.$delete({ json: { id: m.key } }),
				),
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
		queryFn: async () => {
			const res = await client.api.tasks.$get()
			if (!res.ok) throw new Error('Failed to fetch tasks')
			return res.json()
		},
		onInsert: async ({ transaction }) => {
			await Promise.all(
				transaction.mutations.map((m) =>
					client.api.tasks.create.$post({ json: m.modified }),
				),
			)
		},
		onUpdate: async ({ transaction }) => {
			await Promise.all(
				transaction.mutations.map((m) =>
					client.api.tasks.update.$put({ json: m.modified }),
				),
			)
		},
		onDelete: async ({ transaction }) => {
			await Promise.all(
				transaction.mutations.map((m) =>
					client.api.tasks.delete.$delete({ json: { id: m.key } }),
				),
			)
		},
	}),
)
