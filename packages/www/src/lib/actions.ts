import { uuidv7 } from 'uuidv7'
import { searchWorker } from '@/workers/search'
import { BLANK_PAGE_MD } from './constants'
import { db, type Note } from './db'
import { splitMarkdown } from './utils'

export const createNote = async (markdown: string = BLANK_PAGE_MD) => {
	const id = uuidv7()
	const note: Note = {
		id,
		title: '',
		body: '',
		markdown,
		createdAt: new Date().toISOString(),
	}

	await db.notes.add(note)
	await searchWorker.add([note])

	return id
}

export const updateNote = async (id: string, markdown: string) => {
	const { title, body } = splitMarkdown(markdown)

	await db.notes.update(id, { title, body, markdown })
	await searchWorker.update([{ id, title, body }])
}

export const getNoteCount = async () => {
	return await db.notes.count()
}
