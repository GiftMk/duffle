import { type Remote, wrap } from 'comlink'
import {
	boardsCollection,
	columnsCollection,
	notesCollection,
	tasksCollection,
} from '@/lib/collections'
import type { BoardEntity, NoteEntity, TaskEntity } from '@/lib/schemas'
import type { SearchItem, SearchWorker } from './search.worker'

export const taskToSearchItem = (
	task: TaskEntity,
	boardId?: string,
): SearchItem => ({
	id: task.id,
	title: task.title,
	body: task.description ?? '',
	type: 'task',
	boardId,
})

export const noteToSearchItem = (note: NoteEntity): SearchItem => ({
	id: note.id,
	title: note.title,
	body: note.body,
	type: 'note',
})

export const boardToSearchItem = (board: BoardEntity): SearchItem => ({
	id: board.id,
	title: board.title,
	body: '',
	type: 'board',
	boardId: board.id,
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
	const boardRows = await boardsCollection.toArrayWhenReady()
	const noteRows = await notesCollection.toArrayWhenReady()
	const taskRows = await tasksCollection.toArrayWhenReady()
	const columnRows = await columnsCollection.toArrayWhenReady()

	const boards: SearchItem[] = boardRows.map(boardToSearchItem)
	const notes: SearchItem[] = noteRows.map(noteToSearchItem)

	const tasks: SearchItem[] = taskRows.map((task) => {
		const boardId = columnRows.find((c) => c.id === task.columnId)?.boardId
		return taskToSearchItem(task, boardId)
	})

	await searchWorker.add([...boards, ...notes, ...tasks])
}
