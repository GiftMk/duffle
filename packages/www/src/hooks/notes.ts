import {
	queryOptions,
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from '@tanstack/react-query'
import { produce } from 'immer'
import { uuidv7 } from 'uuidv7'
import { upsertItem } from '@/lib/query-list'
import { type NoteEntity, noteSchema } from '@/lib/schemas'
import { splitMarkdown, utcNow } from '@/lib/utils'
import {
	createNote as createNoteFn,
	getNotes,
	updateNote as updateNoteFn,
} from '@/server/notes'

export const notesQuery = queryOptions({
	queryKey: ['notes'],
	queryFn: async () => noteSchema.array().parse(await getNotes()),
	staleTime: Infinity,
})

export const useNote = (id: string) => {
	const { data } = useSuspenseQuery(notesQuery)
	return data.find((note) => note.id === id)
}

export const useCreateNote = () => {
	const queryClient = useQueryClient()

	const { mutate } = useMutation({
		mutationFn: (note: NoteEntity) => createNoteFn({ data: note }),
		onMutate: (note) => {
			queryClient.setQueryData<NoteEntity[]>(notesQuery.queryKey, (old) =>
				upsertItem(old, note),
			)
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: notesQuery.queryKey })
		},
	})

	return () => {
		const timestamp = utcNow()

		const note: NoteEntity = {
			id: uuidv7(),
			title: '',
			body: '',
			markdown: '',
			createdAt: timestamp,
			updatedAt: timestamp,
		}

		mutate(note)

		return note
	}
}

export const useUpdateNote = () => {
	const queryClient = useQueryClient()

	const { mutate } = useMutation({
		mutationFn: (note: NoteEntity) => updateNoteFn({ data: note }),
		onMutate: async (note) => {
			await queryClient.cancelQueries({ queryKey: notesQuery.queryKey })
			const previous = queryClient.getQueryData<NoteEntity[]>(
				notesQuery.queryKey,
			)
			queryClient.setQueryData<NoteEntity[]>(notesQuery.queryKey, (old) =>
				upsertItem(old, note),
			)
			return { previous }
		},
		onError: (_err, _note, context) => {
			queryClient.setQueryData(notesQuery.queryKey, context?.previous)
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: notesQuery.queryKey })
		},
	})

	return (id: string, markdown: string) => {
		const notes =
			queryClient.getQueryData<NoteEntity[]>(notesQuery.queryKey) ?? []
		const note = notes.find((n) => n.id === id)
		if (!note) throw new Error(`Note with id '${id}' not found`)

		const { title, description: body } = splitMarkdown(markdown)

		mutate(
			produce(note, (draft) => {
				draft.markdown = markdown
				draft.title = title ?? ''
				draft.body = body ?? ''
				draft.updatedAt = utcNow()
			}),
		)
	}
}
