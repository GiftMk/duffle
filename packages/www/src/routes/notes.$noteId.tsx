import { createFileRoute } from '@tanstack/react-router'
import { MarkdownEditor } from '@/components/markdown/editor'
import { NoteNotFound } from '@/components/notes/note-not-found'
import { Sidebar } from '@/components/sidebar'
import { useNote } from '@/hooks/notes'
import { updateNote } from '@/lib/actions'
import { notesCollection } from '@/lib/collections'

export const Route = createFileRoute('/notes/$noteId')({
	component: RouteComponent,
	loader: () => notesCollection.preload(),
})

function RouteComponent() {
	const { noteId } = Route.useParams()
	const note = useNote(noteId)

	if (!note) {
		return <NoteNotFound />
	}

	return (
		<main className='flex h-full w-full bg-surface-100'>
			<Sidebar />
			<MarkdownEditor
				key={note.id}
				defaultValue={note.markdown}
				onChange={(markdown) => updateNote(note.id, markdown)}
			/>
		</main>
	)
}
