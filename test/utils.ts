import { uuidv7 } from 'uuidv7'
import type { NoteEntity } from '@/lib/schemas'
import { utcNow } from '@/lib/utils'

export const createUser = ({
	isAnonymous = false,
}: {
	isAnonymous?: boolean
} = {}) => {
	const id = uuidv7()
	return {
		id,
		name: `Test User ${id}`,
		email: `test-${id}@example.com`,
		isAnonymous,
	}
}

export const createNote = (userId: string, note: Partial<NoteEntity>) => {
	const title = note.title ?? ''
	const body = note.body ?? ''
	const markdown = `# ${title}\n${body}`

	return {
		id: uuidv7(),
		userId,
		title,
		body,
		markdown,
		createdAt: note.createdAt ?? utcNow(),
		updatedAt: note.updatedAt ?? utcNow(),
	}
}

export const minusDays = (dateStr: string, days: number) => {
	const date = new Date(dateStr)
	date.setDate(date.getDate() - days)
	return date.toISOString()
}
