import { documentSchema } from '@duffle/api'
// import { db } from './db'
import {
	createCollection,
	localStorageCollectionOptions,
} from '@tanstack/react-db'

export const noteCollection = createCollection(
	localStorageCollectionOptions({
		id: 'documents',
		storageKey: 'duffle-documents',
		schema: documentSchema,
		getKey: (item) => item.id,
	}),
)

// const queryClient = new QueryClient()

// const todoGetThisWorking = queryCollectionOptions({
// 		queryKey: ['documents'],
// 		queryClient,
// 		queryFn: async () => {
// 			return await getDocuments(db)
// 		},
// 		schema: documentSchema,
// 		getKey: (item) => item.id,
// 		onInsert: async ({ transaction }) => {
// 			const doc = transaction.mutations[0].modified

// 			return createDocument(db, {
// 				id: doc.id,
// 				markdown: doc.markdown,
// 				createdAt: doc.createdAt,
// 			})
// 		},
// 		onUpdate: async ({ transaction }) => {
// 			const { original, modified } = transaction.mutations[0]

// 			if (!modified.markdown) {
// 				return
// 			}

// 			return updateDocument(db, {
// 				id: original.id,
// 				markdown: modified.markdown,
// 				updatedAt: new Date().toISOString(),
// 			})
// 		},
// 		onDelete: async ({ transaction }) => {
// 			const doc = transaction.mutations[0].original
// 			return deleteDocument(db, doc.id)
// 		},
// 	})
