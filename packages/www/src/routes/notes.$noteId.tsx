import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { EditorSpine } from '@/components/editor-spine'
import { CurrentNoteProvider } from '@/components/note-provider'
import { db, type Note } from '@/lib/db'
import { MarkdownEditor } from '../components/editor'

export const Route = createFileRoute('/notes/$noteId')({
	component: RouteComponent,
})

function RouteComponent() {
	const [note, setNote] = useState<Note | undefined>()
	const [editorKey, setEditorKey] = useState(0)
	const params = Route.useParams()

	useEffect(() => {
		db.notes.get(params.noteId).then(setNote)
	}, [params.noteId])

	const reload = async () => {
		const updated = await db.notes.get(params.noteId)
		if (updated && updated.markdown !== note?.markdown) {
			setNote(updated)
			setEditorKey((key) => key + 1)
		}
	}

	if (note)
		return (
			<CurrentNoteProvider reload={reload}>
				<main className='flex h-full w-full items-center justify-center'>
					<EditorSpine />
					<MarkdownEditor key={`${note.id}:${editorKey}`} note={note} />
				</main>
			</CurrentNoteProvider>
		)
}
