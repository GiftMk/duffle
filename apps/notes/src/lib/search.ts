import { type Remote, wrap } from 'comlink'
import { notesCollection } from '@/lib/collections'
import type { NoteEntity } from '@/lib/schemas'
import type { SearchItem, SearchWorker } from './search.worker'

export const noteToSearchItem = (note: NoteEntity): SearchItem => ({
	id: note.id,
	title: note.title,
	body: note.body,
	type: 'note',
})

const NoOpWorker = new Proxy(
	{},
	{ get: () => async () => undefined },
) as Remote<SearchWorker>

const createSearchWorker = (): Remote<SearchWorker> => {
	if (typeof Worker === 'undefined') {
		// SSR hack
		return NoOpWorker
	}

	const worker = new Worker(new URL('./search.worker.ts', import.meta.url), {
		type: 'module',
	})
	return wrap<SearchWorker>(worker)
}

export const searchWorker = createSearchWorker()

export const preloadSearchIndex = async () => {
	const noteRows = await notesCollection.toArrayWhenReady()
	const notes: SearchItem[] = noteRows.map(noteToSearchItem)

	await searchWorker.add(notes)
}
