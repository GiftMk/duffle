import { createFileRoute } from '@tanstack/react-router'
import { AddNoteCard } from '@/components/notes/add-note-card'
import { NoteCard } from '@/components/notes/note-card'
import { useNotes } from '@/hooks/notes'
import { notesCollection } from '@/lib/collections'

export const Route = createFileRoute('/_app/notes/')({
	component: RouteComponent,
	loader: () => notesCollection.preload(),
})

function RouteComponent() {
	const notes = useNotes()

	return (
		<div className='h-full w-full overflow-y-auto px-8 py-4'>
			<h1 className='font-bold text-3xl tracking-tight'>Notes</h1>
			<div className='mt-8 flex flex-wrap gap-6'>
				<AddNoteCard />
				{notes.map((note) => (
					<NoteCard key={note.id} note={note} />
				))}
			</div>
		</div>
	)
}
