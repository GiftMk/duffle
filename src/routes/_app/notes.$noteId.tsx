import { createFileRoute } from '@tanstack/react-router'
import { MarkdownEditor } from '@/components/editor'
import { EditorErrorBoundary } from '@/components/editor-error-boundary'
import { NoteNotFound } from '@/components/note-not-found'
import { useNote, useUpdateNote } from '@/hooks/notes'
import { notesCollection } from '@/lib/collections'

export const Route = createFileRoute('/_app/notes/$noteId')({
	ssr: false,
	component: RouteComponent,
	loader: () => notesCollection.preload(),
})

function RouteComponent() {
	const { noteId } = Route.useParams()
	const note = useNote(noteId)
	const updateNote = useUpdateNote()

	if (!note) {
		return <NoteNotFound />
	}

	const handleChange = (markdown: string) => {
		updateNote(note.id, markdown)
	}

	return (
		<EditorErrorBoundary key={note.id}>
			<MarkdownEditor defaultValue={note.markdown} onChange={handleChange} />
		</EditorErrorBoundary>
	)
}
