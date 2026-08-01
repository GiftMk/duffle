import { db } from './db'
import { splitMarkdown } from './utils'

export const updateNote = async (id: string, markdown: string) => {
	const { title, body } = splitMarkdown(markdown)

	await db.notes.update(id, { title, body, markdown })
}
