import {
	createDocument,
	deleteDocument,
	documentSchema,
	getDocuments,
	updateDocument,
} from '@duffle/rpc'
import { QueryClient } from '@tanstack/query-core'
import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { createCollection } from '@tanstack/react-db'
import { database } from './db'

const queryClient = new QueryClient()

export const documentCollection = createCollection(
	queryCollectionOptions({
		queryKey: ['documents'],
		queryClient,
		queryFn: async () => {
			return await getDocuments(database())
		},
		schema: documentSchema,
		getKey: (item) => item.id,
		onInsert: async ({ transaction }) => {
			const doc = transaction.mutations[0].modified

			return createDocument(database(), {
				id: doc.id,
				markdown: doc.markdown,
				createdAt: doc.createdAt,
			})
		},
		onUpdate: async ({ transaction }) => {
			const { original, modified } = transaction.mutations[0]

			if (!modified.markdown) {
				return
			}

			return updateDocument(database(), {
				id: original.id,
				markdown: modified.markdown,
				updatedAt: new Date().toISOString(),
			})
		},
		onDelete: async ({ transaction }) => {
			const doc = transaction.mutations[0].original
			return deleteDocument(database(), doc.id)
		},
	}),
)
