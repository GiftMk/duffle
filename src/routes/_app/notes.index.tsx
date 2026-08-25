import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { uuidv7 } from 'uuidv7'
import { AddNoteCard } from '@/components/notes/add-note-card'
import { NoteCard } from '@/components/notes/note-card'
import { notesQuery, useNewNote, useNotes } from '@/hooks/notes'

export const Route = createFileRoute('/_app/notes/')({
	component: RouteComponent,
	loader: ({ context }) => context.queryClient.ensureQueryData(notesQuery),
})

function RouteComponent() {
	const [pendingNoteId] = useState(() => uuidv7())
	const notes = useNotes().filter((note) => note.id !== pendingNoteId)
	const newNote = useNewNote(pendingNoteId)

	const handleAddNote = () => {
		newNote.create()
		newNote.open()
	}

	return (
		<div className='h-full w-full overflow-y-auto px-8 py-4'>
			<h1 className='font-bold text-3xl tracking-tight'>Notes</h1>
			<div className='mt-8 flex flex-wrap gap-6'>
				<AddNoteCard onClick={handleAddNote} />
				{notes.map((note) => (
					<NoteCard key={note.id} note={note} />
				))}
			</div>
		</div>
	)
}
