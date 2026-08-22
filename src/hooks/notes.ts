import {
	debounceStrategy,
	useLiveQuery,
	usePacedMutations,
} from '@tanstack/react-db'
import { uuidv7 } from 'uuidv7'
import { notesCollection } from '@/lib/collections'
import type { NoteEntity } from '@/lib/schemas'
import { splitMarkdown, utcNow } from '@/lib/utils'
import { updateNoteFn } from '@/server/notes.functions'

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

type UpdateNoteVariables = { id: string; markdown: string }

export const useUpdateNote = () => {
	const mutate = usePacedMutations<UpdateNoteVariables, NoteEntity>({
		onMutate: ({ id, markdown }) => {
			const note = notesCollection.get(id)
			if (!note) throw new Error(`Note with id '${id}' not found`)

			const { title, description: body } = splitMarkdown(markdown)

			notesCollection.update(id, (draft) => {
				draft.markdown = markdown
				draft.title = title ?? ''
				draft.body = body ?? ''
				draft.updatedAt = utcNow()
			})
		},
		mutationFn: async ({ transaction }) => {
			await Promise.all(
				transaction.mutations.map((m) => updateNoteFn({ data: m.modified })),
			)
			await notesCollection.utils.refetch()
		},
		strategy: debounceStrategy({ wait: 250 }),
	})

	return (id: string, markdown: string) => mutate({ id, markdown })
}

export const useDeleteNote = () => {
	return (id: string) => {
		const note = notesCollection.get(id)
		if (!note) throw new Error(`Note with id '${id}' not found`)

		notesCollection.delete(id)
	}
}
