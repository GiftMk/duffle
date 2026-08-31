import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { createCollection } from '@tanstack/react-db'
import { QueryClient } from '@tanstack/react-query'
import { noteSchema } from '@/lib/schemas'
import {
	createNoteFn,
	deleteNoteFn,
	getNotesFn,
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
		startSync: false,
		onInsert: async ({ transaction }) => {
			await Promise.all(
				transaction.mutations.map((m) => createNoteFn({ data: m.modified })),
			)
		},
		onDelete: async ({ transaction }) => {
			await Promise.all(
				transaction.mutations.map((m) => deleteNoteFn({ data: { id: m.key } })),
			)
		},
	}),
)
