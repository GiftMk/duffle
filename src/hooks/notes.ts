import {
	queryOptions,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { debounce } from 'es-toolkit'
import { uuidv7 } from 'uuidv7'
import { type NoteEntity, noteSchema } from '@/lib/schemas'
import {
	createNoteFn,
	deleteNoteFn,
	getNoteFn,
	getNotesFn,
	updateNoteFn,
} from '@/server/notes.functions'

export const noteQuery = (id: string) =>
	queryOptions({
		queryKey: ['note', id],
		queryFn: async () =>
			noteSchema.optional().parse(await getNoteFn({ data: { id } })),
	})

export const notesQuery = queryOptions({
	queryKey: ['notes'],
	queryFn: async () => noteSchema.array().parse(await getNotesFn()),
})

export const useNotes = () => {
	const { data } = useQuery(notesQuery)
	return data ?? []
}

export const useNote = (id: string): NoteEntity | undefined => {
	const { data } = useQuery(noteQuery(id))
	return data
}

export const useNewNote = () => {
	const navigate = useNavigate()
	let id = uuidv7()

	const { mutate } = useMutation({
		mutationFn: (note: Omit<NoteEntity, 'updatedAt' | 'createdAt'>) =>
			createNoteFn({ data: note }),
	})

	const create = () => {
		const note = {
			id,
			title: '',
			body: '',
			markdown: '# ',
		}

		mutate(note)
		// re-gen note id for future calls
		id = uuidv7()
	}

	const open = () => {
		navigate({ to: '/notes/$noteId', params: { noteId: id } })
	}

	return { create, open }
}

export const useUpdateNote = () => {
	const { mutate } = useMutation({
		mutationFn: (note: Pick<NoteEntity, 'id' | 'markdown'>) =>
			updateNoteFn({ data: note }),
	})

	return debounce(mutate, 250)
}

export const useDeleteNote = () => {
	const queryClient = useQueryClient()
	const { mutate } = useMutation({
		mutationFn: (id: string) => deleteNoteFn({ data: { id } }),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
	})

	return mutate
}
