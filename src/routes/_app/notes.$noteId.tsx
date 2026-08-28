import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { debounce } from 'es-toolkit'
import { MarkdownEditor } from '@/components/editor'
import { NoteNotFound } from '@/components/note-not-found'
import { noteQueryOptions } from '@/lib/queries/note'
import { Route as NotesIndexRoute } from '@/routes/_app/notes.index'
import { Route as HomeRoute } from '@/routes/index'
import { updateNoteFn } from '@/server/notes.functions'

export const Route = createFileRoute('/_app/notes/$noteId')({
	component: RouteComponent,
	loader: ({ params, context }) =>
		context.queryClient.ensureQueryData(noteQueryOptions(params.noteId)),
})

function RouteComponent() {
	const { noteId } = Route.useParams()
	const queryClient = useQueryClient()
	const router = useRouter()
	const { data: note } = useSuspenseQuery(noteQueryOptions(noteId))

	const updateNote = debounce(
		async (data: { id: string; markdown: string }) => {
			await updateNoteFn({ data })
			router.invalidate({
				filter: (match) =>
					match.routeId === NotesIndexRoute.id ||
					match.routeId === HomeRoute.id,
			})
		},
		250,
	)

	if (!note) {
		return <NoteNotFound />
	}

	const handleChange = (markdown: string) => {
		queryClient.setQueryData(noteQueryOptions(note.id).queryKey, (current) =>
			current ? { ...current, markdown } : current,
		)
		updateNote({ id: note.id, markdown })
	}

	return (
		<MarkdownEditor
			key={note.id}
			defaultValue={note.markdown}
			onChange={handleChange}
		/>
	)
}
