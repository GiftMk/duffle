import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { debounce } from 'es-toolkit'
import { MarkdownEditor } from '@/components/editor'
import { NoteNotFound } from '@/components/note-not-found'
import { noteQueryOptions } from '@/lib/queries/note'
import { updateNoteFn } from '@/server/notes.functions'

export const Route = createFileRoute('/_app/notes/$noteId')({
	component: RouteComponent,
	loader: ({ params, context }) =>
		context.queryClient.ensureQueryData(noteQueryOptions(params.noteId)),
})

const updateNote = debounce(updateNoteFn, 250)

function RouteComponent() {
	const { noteId } = Route.useParams()
	const queryClient = useQueryClient()
	const { data: note } = useSuspenseQuery(noteQueryOptions(noteId))

	if (!note) {
		return <NoteNotFound />
	}

	const handleChange = (markdown: string) => {
		queryClient.setQueryData(noteQueryOptions(note.id).queryKey, (current) =>
			current ? { ...current, markdown } : current,
		)
		updateNote({ data: { id: note.id, markdown } })
	}

	return (
		<MarkdownEditor
			key={note.id}
			defaultValue={note.markdown}
			onChange={handleChange}
		/>
	)
}
