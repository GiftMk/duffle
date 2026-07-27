import { createFileRoute } from '@tanstack/react-router'
import { EditorSpine } from '@/components/editor-spine'
import { db, type Note } from '@/lib/db'
import { MarkdownEditor } from '../components/editor'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/notes/$noteId')({
	component: RouteComponent,
})

function RouteComponent() {
	const [note, setNote] = useState<Note | undefined>()
	const params = Route.useParams()

	useEffect(() => {
		db.notes.get(params.noteId).then(setNote)
	}, [params.noteId])

	if (note)
		return (
			<main className='flex h-full w-full items-center justify-center'>
				<EditorSpine />
				<MarkdownEditor note={note} />
			</main>
		)
}
