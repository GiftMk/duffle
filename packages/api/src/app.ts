import Elysia from 'elysia'
import { createDocument } from './routes/create-document'
import { deleteDocument } from './routes/delete-document'
import { getDocument } from './routes/get-document'
import { getDocuments } from './routes/get-documents'
import { updateDocument } from './routes/update-document'

export const app = new Elysia({ prefix: '/api' }).group('/documents', (group) =>
	group
		.use(getDocument)
		.use(getDocuments)
		.use(createDocument)
		.use(updateDocument)
		.use(deleteDocument),
)
