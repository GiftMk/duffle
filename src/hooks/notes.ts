import {
	queryOptions,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useMemo, useRef } from 'react'
import { uuidv7 } from 'uuidv7'
import { removeItem, upsertItem } from '@/lib/query-list'
import { type NoteEntity, noteSchema } from '@/lib/schemas'
import { debounce, splitMarkdown, utcNow } from '@/lib/utils'
import {
	createNoteFn,
	deleteNoteFn,
	getNotesFn,
	updateNoteFn,
} from '@/server/notes.functions'

export const notesQuery = queryOptions({
	queryKey: ['notes'],
	queryFn: async () => noteSchema.array().parse(await getNotesFn()),
	staleTime: Infinity,
})

export const useNotes = () => {
	// Plain useQuery (not suspense) so pages without the notes loader, like
	// login/logout, render with an empty list instead of suspending on a query
	// that would fail while signed out.
	const { data } = useQuery(notesQuery)
	return useMemo(
		() =>
			[...(data ?? [])].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
		[data],
	)
}

export const useNote = (id: string) => {
	const notes = useNotes()
	return notes.find((note) => note.id === id)
}

export const useCreateNote = () => {
	const queryClient = useQueryClient()

	const { mutate } = useMutation({
		mutationFn: (note: NoteEntity) => createNoteFn({ data: note }),
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
		onError: (_error, _note, context) => {
			queryClient.setQueryData(notesQuery.queryKey, context?.previous)
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
			markdown: '# ',
			createdAt: timestamp,
			updatedAt: timestamp,
		}

		mutate(note)

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
	const queryClient = useQueryClient()
	// Snapshot for rollback, captured when a batch of edits starts.
	const previousRef = useRef<NoteEntity[] | undefined>(undefined)
	// Latest pending write per note, flushed together after the debounce.
	const pendingRef = useRef(new Map<string, NoteEntity>())

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

	const flush = useMemo(
		() =>
			debounce(() => {
				const pending = [...pendingRef.current.values()]
				pendingRef.current.clear()
				if (pending.length > 0) mutate(pending)
			}, 250),
		[mutate],
	)

	return (id: string, markdown: string) => {
		const notes =
			queryClient.getQueryData<NoteEntity[]>(notesQuery.queryKey) ?? []
		const note = notes.find((n) => n.id === id)
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
		flush()
	}
}

export const useDeleteNote = () => {
	const queryClient = useQueryClient()

	const { mutate } = useMutation({
		mutationFn: (id: string) => deleteNoteFn({ data: { id } }),
		onMutate: async (id) => {
			await queryClient.cancelQueries({ queryKey: notesQuery.queryKey })
			const previous = queryClient.getQueryData<NoteEntity[]>(
				notesQuery.queryKey,
			)
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
		const notes =
			queryClient.getQueryData<NoteEntity[]>(notesQuery.queryKey) ?? []
		if (!notes.some((note) => note.id === id)) {
			throw new Error(`Note with id '${id}' not found`)
		}
		mutate(id)
	}
}
