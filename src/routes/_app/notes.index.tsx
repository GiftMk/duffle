import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { AddNoteCard } from '@/components/notes/add-note-card'
import { NoteCard } from '@/components/notes/note-card'
import { emptyNote } from '@/lib/utils'
import { createNoteFn, getNotesFn } from '@/server/notes.functions'

export const Route = createFileRoute('/_app/notes/')({
	component: RouteComponent,
	loader: async () => getNotesFn(),
})

function RouteComponent() {
	const notes = Route.useLoaderData()
	const navigate = useNavigate()

	const handleAddNote = async () => {
		const note = await createNoteFn({ data: emptyNote() })
		if (note) {
			navigate({ to: '/notes/$noteId', params: { noteId: note.id } })
		}
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
