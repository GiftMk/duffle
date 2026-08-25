import { createFileRoute } from '@tanstack/react-router'
import { MarkdownEditor } from '@/components/editor'
import { NoteNotFound } from '@/components/note-not-found'
import { notesQuery, useNote, useUpdateNote } from '@/hooks/notes'

export const Route = createFileRoute('/_app/notes/$noteId')({
	component: RouteComponent,
	loader: ({ context }) => context.queryClient.ensureQueryData(notesQuery),
})

function RouteComponent() {
	const { noteId } = Route.useParams()
	const note = useNote(noteId)
	const updateNote = useUpdateNote()

	if (!note) {
		return <NoteNotFound />
	}

	return (
		<MarkdownEditor
			key={note.id}
			defaultValue={note.markdown}
			onChange={(markdown) => updateNote(note.id, markdown)}
		/>
	)
}
