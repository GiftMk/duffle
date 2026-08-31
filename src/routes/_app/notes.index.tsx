import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { uuidv7 } from 'uuidv7'
import { AddNoteCard } from '@/components/notes/add-note-card'
import { NoteCard } from '@/components/notes/note-card'
import { NotesSearchInput } from '@/components/notes/notes-search-input'
import { useNewNote, useNotes } from '@/hooks/notes'
import { useSearch } from '@/hooks/search'
import { notesCollection } from '@/lib/collections'

export const Route = createFileRoute('/_app/notes/')({
	ssr: false,
	component: RouteComponent,
	loader: () => notesCollection.preload(),
})

function RouteComponent() {
	const [pendingNoteId] = useState(() => uuidv7())
	const notes = useNotes().filter((note) => note.id !== pendingNoteId)
	const newNote = useNewNote()
	const { query, setQuery, results, state, isRefreshing } = useSearch()

	const handleAddNote = () => {
		const note = newNote.create()
		newNote.open(note.id)
	}

	const hasQuery = query.trim().length > 0
	const visibleNotes = hasQuery ? results : notes

	return (
		<div className='h-full w-full overflow-y-auto px-8 py-4'>
			<h1 className='font-bold text-3xl tracking-tight'>Notes</h1>
			<NotesSearchInput
				value={query}
				onChange={setQuery}
				isLoading={state === 'loading' || isRefreshing}
			/>
			{hasQuery && state === 'empty' && (
				<p className='mt-8 text-typography-600'>No notes found.</p>
			)}
			{(!hasQuery || state === 'results') && (
				<div className='mt-8 flex flex-wrap gap-6'>
					{!hasQuery && <AddNoteCard onClick={handleAddNote} />}
					{visibleNotes.map((note) => (
						<NoteCard key={note.id} note={note} />
					))}
				</div>
			)}
		</div>
	)
}
