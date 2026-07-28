import { searchWorker } from '@/workers/search'
import { db, type Note } from './db'

type ImportPayload = { notes: Note[] }

export const fetchImportPreview = async (code: string) => {
	const res = await fetch(`/api/import/${code}`)

	if (!res.ok) {
		throw new Error(
			res.status === 404
				? 'No notes found for that code'
				: 'Failed to fetch notes',
		)
	}

	const { notes } = (await res.json()) as ImportPayload
	return notes
}

export const importNotes = async (notes: Note[], mode: 'replace' | 'merge') => {
	if (mode === 'replace') {
		await db.notes.clear()
	}

	await db.notes.bulkPut(notes)
	await searchWorker.clear()
	await searchWorker.add(await db.notes.toArray())
}
