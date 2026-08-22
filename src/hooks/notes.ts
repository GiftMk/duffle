import { useLiveQuery } from '@tanstack/react-db'
import { uuidv7 } from 'uuidv7'
import { notesCollection } from '@/lib/collections'
import type { NoteEntity } from '@/lib/schemas'
import { noteToSearchItem, searchWorker } from '@/lib/search'
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
		searchWorker.add([noteToSearchItem(note)])

		return note
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

		const updated = notesCollection.get(id)
		if (updated) searchWorker.add([noteToSearchItem(updated)])
	}
}

export const useDeleteNote = () => {
	return (id: string) => {
		const note = notesCollection.get(id)
		if (!note) throw new Error(`Note with id '${id}' not found`)

		notesCollection.delete(id)
	}
}
