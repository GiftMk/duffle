import { uuidv7 } from 'uuidv7'
import { db, type Note } from './db'
import { splitMarkdown } from './utils'
import { searchWorker } from '@/workers/search'

export const createNote = async () => {
	const id = uuidv7()
	const note: Note = {
		id,
		title: '',
		body: '',
		markdown: '# ',
		createdAt: new Date().toISOString(),
	}

	await db.notes.add(note)
	searchWorker.send({ type: 'add', payload: [note] })

	return id
}

export const updateNote = async (id: string, markdown: string) => {
	const { title, body } = splitMarkdown(markdown)

	await db.notes.update(id, { title, body, markdown })
	searchWorker.send({ type: 'update', payload: [{ id, title, body }] })
}
