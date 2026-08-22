import { useLiveQuery } from '@tanstack/react-db'
import { useNavigate } from '@tanstack/react-router'
import { uuidv7 } from 'uuidv7'
import { notesCollection } from '@/lib/collections'
import type { NoteEntity } from '@/lib/schemas'
import { splitMarkdown, utcNow } from '@/lib/utils'

export const useNotes = () => {
	const { data } = useLiveQuery((q) =>
		q
			.from({ note: notesCollection })
			.orderBy(({ note }) => note.updatedAt, 'desc'),
	)
	return data
}

export const useNote = (id: string) => {
	const notes = useNotes()
	return notes.find((note) => note.id === id)
}

export const useCreateNote = () => {
	return () => {
		const timestamp = utcNow()

		const note: NoteEntity = {
			id: uuidv7(),
			title: '',
			body: '',
			markdown: '# ',
			createdAt: timestamp,
			updatedAt: timestamp,
		}

		notesCollection.insert(note)

		return note
	}
}

export const useCreateAndOpenNote = () => {
	const createNote = useCreateNote()
	const navigate = useNavigate()

	return () => {
		const note = createNote()
		navigate({ to: '/notes/$noteId', params: { noteId: note.id } })
	}
}

export const useUpdateNote = () => {
	return (id: string, markdown: string) => {
		const note = notesCollection.get(id)
		if (!note) throw new Error(`Note with id '${id}' not found`)

		const { title, description: body } = splitMarkdown(markdown)

		notesCollection.update(id, (draft) => {
			draft.markdown = markdown
			draft.title = title ?? ''
			draft.body = body ?? ''
			draft.updatedAt = utcNow()
		})
	}
}

export const useDeleteNote = () => {
	return (id: string) => {
		const note = notesCollection.get(id)
		if (!note) throw new Error(`Note with id '${id}' not found`)

		notesCollection.delete(id)
	}
}
