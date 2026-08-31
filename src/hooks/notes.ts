import {
	debounceStrategy,
	useLiveQuery,
	usePacedMutations,
} from '@tanstack/react-db'
import { useNavigate } from '@tanstack/react-router'
import { notesCollection } from '@/lib/collections'
import type { NoteEntity } from '@/lib/schemas'
import { newNoteEntity, splitMarkdown, utcNow } from '@/lib/utils'
import { updateNoteFn } from '@/server/notes.functions'

export const useNotes = () => {
	const { data } = useLiveQuery({
		query: (q) =>
			q
				.from({ note: notesCollection })
				.orderBy(({ note }) => note.updatedAt, 'desc'),
	})
	return data
}

export const useNote = (id: string) => {
	const notes = useNotes()
	return notes.find((note) => note.id === id)
}

export const useNewNote = () => {
	const navigate = useNavigate()

	const create = (markdown = '# '): NoteEntity => {
		const note = newNoteEntity(markdown)
		notesCollection.insert(note)
		return note
	}

	const open = (id: string) => {
		navigate({ to: '/notes/$noteId', params: { noteId: id } })
	}

	return { create, open }
}

type UpdateNoteVariables = { id: string; markdown: string }

export const useUpdateNote = () => {
	const mutate = usePacedMutations<UpdateNoteVariables, NoteEntity>({
		onMutate: ({ id, markdown }) => {
			const note = notesCollection.get(id)
			if (!note) throw new Error(`Note with id '${id}' not found`)

			const { title, body } = splitMarkdown(markdown)

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
