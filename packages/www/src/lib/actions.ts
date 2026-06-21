import { uuidv7 } from 'uuidv7'
import { db } from './db'

export const createNote = async () => {
	const id = uuidv7()

	await db.notes.add({
		id,
		markdown: '# ',
		createdAt: new Date().toISOString(),
	})

	return id
}

export const updateNote = async (id: string, markdown: string) => {
	await db.notes.update(id, { markdown })
}
