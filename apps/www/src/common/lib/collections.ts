import type { Document } from '@duffle/api'
import { documentSchema } from '@duffle/api'
import { QueryClient } from '@tanstack/query-core'
import { queryCollectionOptions } from '@tanstack/query-db-collection'
import type { TransactionWithMutations } from '@tanstack/react-db'
import { createCollection } from '@tanstack/react-db'
import {
	createDocument,
	deleteDocument,
	getDocuments,
	updateDocument,
} from './api'

const queryClient = new QueryClient()

export const handleUpdate = async (
	transaction: TransactionWithMutations<Document, 'update'>,
) => {
	const { original, changes } = transaction.mutations[0]

	if (!changes.markdown) {
		return
	}

	const { error } = await updateDocument(
		original.id,
		changes.markdown,
		new Date().toISOString(),
	)

	if (error) {
		throw error
	}
}

export const documentCollection = createCollection(
	queryCollectionOptions({
		queryKey: ['documents'],
		queryClient,
		queryFn: async () => {
			const { data, error } = await getDocuments()

			if (error) {
				throw error
			}

			return data
		},
		schema: documentSchema,
		getKey: (item) => item.id,
		onInsert: async ({ transaction }) => {
			const item = transaction.mutations[0].modified
			const { error } = await createDocument(
				item.id,
				item.markdown,
				item.createdAt,
			)

			if (error) {
				throw error
			}
		},
		onUpdate: ({ transaction }) => handleUpdate(transaction),
		onDelete: async ({ transaction }) => {
			const item = transaction.mutations[0].original

			const { error } = await deleteDocument(item.id)

			if (error) {
				throw error
			}
		},
	}),
)
