import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { createCollection } from '@tanstack/react-db'
import { QueryClient } from '@tanstack/react-query'
import { noteSchema } from '@/lib/schemas'
import {
	createNoteFn,
	deleteNoteFn,
	getNotesFn,
	updateNoteFn,
} from '@/server/notes.functions'

export const queryClient = new QueryClient()

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
