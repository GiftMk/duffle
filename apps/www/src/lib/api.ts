import type { App } from '@duffle/api'
import { edenFetch } from '@elysia/eden/fetch'
import { env } from '../environment'

export const fetch = edenFetch<App>(env.VITE_API_URL)

export const createDocument = (
	id: string,
	markdown: string,
	createdAt: string,
) => {
	return fetch('/api/documents/create', {
		method: 'POST',
		body: {
			id,
			markdown,
			createdAt,
		},
	})
}

export const updateDocument = (
	id: string,
	markdown: string,
	updatedAt: string,
) => {
	return fetch('/api/documents/update', {
		method: 'PUT',
		body: {
			id,
			markdown,
			updatedAt,
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

export const deleteDocument = (id: string) => {
	return fetch('/api/documents/:id', {
		method: 'DELETE',
		params: {
			id,
		},
	})
}
