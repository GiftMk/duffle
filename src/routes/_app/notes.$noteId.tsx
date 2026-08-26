import { createFileRoute } from '@tanstack/react-router'
import { debounce } from 'es-toolkit'
import { MarkdownEditor } from '@/components/editor'
import { NoteNotFound } from '@/components/note-not-found'
import { getNoteFn, updateNoteFn } from '@/server/notes.functions'

export const Route = createFileRoute('/_app/notes/$noteId')({
	component: RouteComponent,
	loader: ({ params }) => getNoteFn({ data: { id: params.noteId } }),
})

const updateNote = debounce(updateNoteFn, 250)

function RouteComponent() {
	const note = Route.useLoaderData()

	if (!note) {
		return <NoteNotFound />
	}

	return (
		<MarkdownEditor
			key={note.id}
			defaultValue={note.markdown}
			onChange={(markdown) => updateNote({ data: { id: note.id, markdown } })}
		/>
	)
}
