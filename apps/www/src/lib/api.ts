import { edenFetch } from '@elysia/eden/fetch'
import type { App } from 'api'

export const fetch = edenFetch<App>(import.meta.env.VITE_API_URL ?? '')

export const createDocument = (markdown: string) => {
	return fetch('/api/documents/create', {
		method: 'POST',
		body: {
			markdown,
		},
	})
}

export const updateDocument = (id: string, markdown: string) => {
	return fetch('/api/documents/update', {
		method: 'PUT',
		body: {
			id,
			markdown,
		},
	})
}

export const getDocument = (id: string) => {
	return fetch('/api/documents/:id', {
		method: 'GET',
		params: {
			id,
		},
	})
}

export const getDocuments = (q?: string) => {
	return fetch('/api/documents', {
		method: 'GET',
		query: {
			q,
		},
	})
}
