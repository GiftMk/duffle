import { uuidv7 } from 'uuidv7'
import { db, miniSearch, type Note, type SearchItem } from './db'
import { splitMarkdown } from './utils'

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
	miniSearch.add(note)

	return id
}

export const updateNote = async (id: string, markdown: string) => {
	const { title, body } = splitMarkdown(markdown)

	await db.notes.update(id, { title, body, markdown })
	miniSearch.replace({ id, title, body } as SearchItem)
}
