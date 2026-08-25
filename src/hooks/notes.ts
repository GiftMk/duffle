import {
	type QueryClient,
	queryOptions,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useRef } from 'react'
import { removeItem, upsertItem } from '@/lib/query-list'
import { type NoteEntity, noteSchema } from '@/lib/schemas'
import { splitMarkdown, utcNow } from '@/lib/utils'
import {
	createNoteFn,
	deleteNoteFn,
	getNotesFn,
	updateNoteFn,
} from '@/server/notes.functions'

const UPDATE_DEBOUNCE_MS = 250

export const notesQuery = queryOptions({
	queryKey: ['notes'],
	queryFn: async () => noteSchema.array().parse(await getNotesFn()),
	staleTime: Number.POSITIVE_INFINITY,
})

const readNotes = (queryClient: QueryClient) =>
	queryClient.getQueryData<NoteEntity[]>(notesQuery.queryKey)

export const useNotes = () => {
	const { data } = useQuery(notesQuery)
	return [...(data ?? [])].sort((a, b) =>
		b.updatedAt.localeCompare(a.updatedAt),
	)
}

export const useNote = (id: string) => {
	const notes = useNotes()
	return notes.find((note) => note.id === id)
}

export const useNewNote = (id: string) => {
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const { mutate } = useMutation({
		mutationFn: (note: NoteEntity) => createNoteFn({ data: note }),
		onMutate: async (note) => {
			await queryClient.cancelQueries({ queryKey: notesQuery.queryKey })
			const previous = readNotes(queryClient)
			queryClient.setQueryData<NoteEntity[]>(notesQuery.queryKey, (old) =>
				upsertItem(old, note),
			)
			return { previous }
		},
		onError: (_error, _note, context) => {
			queryClient.setQueryData(notesQuery.queryKey, context?.previous)
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: notesQuery.queryKey })
		},
	})

	const create = () => {
		const timestamp = utcNow()

		const note: NoteEntity = {
			id,
			title: '',
			body: '',
			markdown: '# ',
			createdAt: timestamp,
			updatedAt: timestamp,
		}

		mutate(note)

		return note
	}

	const open = () => {
		navigate({ to: '/notes/$noteId', params: { noteId: id } })
	}

	return { create, open }
}

export const useUpdateNote = () => {
	const queryClient = useQueryClient()
	const previousRef = useRef<NoteEntity[] | undefined>(undefined)
	const pendingRef = useRef(new Map<string, NoteEntity>())
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
		undefined,
	)

	const { mutate } = useMutation({
		mutationFn: async (notes: NoteEntity[]) => {
			await Promise.all(notes.map((note) => updateNoteFn({ data: note })))
		},
		onError: () => {
			queryClient.setQueryData(notesQuery.queryKey, previousRef.current)
		},
		onSettled: () => {
			previousRef.current = undefined
			queryClient.invalidateQueries({ queryKey: notesQuery.queryKey })
		},
	})

	const flush = () => {
		const pending = [...pendingRef.current.values()]
		pendingRef.current.clear()
		if (pending.length > 0) mutate(pending)
	}

	return (id: string, markdown: string) => {
		const notes = readNotes(queryClient) ?? []
		const note = notes.find((existing) => existing.id === id)
		if (!note) throw new Error(`Note with id '${id}' not found`)

		previousRef.current ??= notes

		const { title, description: body } = splitMarkdown(markdown)
		const updated: NoteEntity = {
			...note,
			markdown,
			title: title ?? '',
			body: body ?? '',
			updatedAt: utcNow(),
		}

		queryClient.setQueryData<NoteEntity[]>(notesQuery.queryKey, (old) =>
			upsertItem(old, updated),
		)
		pendingRef.current.set(id, updated)

		clearTimeout(timeoutRef.current)
		timeoutRef.current = setTimeout(flush, UPDATE_DEBOUNCE_MS)
	}
}

export const useDeleteNote = () => {
	const queryClient = useQueryClient()

	const { mutate } = useMutation({
		mutationFn: (id: string) => deleteNoteFn({ data: { id } }),
		onMutate: async (id) => {
			await queryClient.cancelQueries({ queryKey: notesQuery.queryKey })
			const previous = readNotes(queryClient)
			queryClient.setQueryData<NoteEntity[]>(notesQuery.queryKey, (old) =>
				removeItem(old, id),
			)
			return { previous }
		},
		onError: (_error, _id, context) => {
			queryClient.setQueryData(notesQuery.queryKey, context?.previous)
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: notesQuery.queryKey })
		},
	})

	return (id: string) => {
		const notes = readNotes(queryClient) ?? []
		if (!notes.some((note) => note.id === id)) {
			throw new Error(`Note with id '${id}' not found`)
		}
		mutate(id)
	}
}
