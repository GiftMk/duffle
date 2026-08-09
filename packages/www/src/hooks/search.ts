import { useEffect, useState } from 'react'
import { useBoards } from '@/hooks/boards'
import { useNotes } from '@/hooks/notes'
import { useAllTasks } from '@/hooks/tasks'
import { columnsCollection } from '@/lib/collections'
import type { BoardEntity, NoteEntity, TaskEntity } from '@/lib/schemas'
import {
	boardToSearchItem,
	noteToSearchItem,
	searchWorker,
	taskToSearchItem,
} from '@/lib/search'
import type { SearchResult } from '@/lib/search.worker'

export const useSearch = () => {
	const [query, setQuery] = useState('')
	const [results, setResults] = useState<SearchResult[]>([])
	const [isSearching, setIsSearching] = useState(false)

	useEffect(() => {
		if (!query.length) {
			setResults([])
			setIsSearching(false)
			return
		}

		setIsSearching(true)
		searchWorker.query(query).then((queryResults) => {
			setResults(queryResults)
			setIsSearching(false)
		})
	}, [query])

	const clear = () => {
		setQuery('')
		setResults([])
	}

	return { query, setQuery, results, isSearching, clear }
}

type RecentEntity =
	| { kind: 'board'; entity: BoardEntity }
	| { kind: 'note'; entity: NoteEntity }
	| { kind: 'task'; entity: TaskEntity }

export const useRecentSearchResults = (limit: number): SearchResult[] => {
	const boards = useBoards()
	const notes = useNotes()
	const tasks = useAllTasks()

	const entities: RecentEntity[] = [
		...boards.map((entity) => ({ kind: 'board' as const, entity })),
		...notes.map((entity) => ({ kind: 'note' as const, entity })),
		...tasks.map((entity) => ({ kind: 'task' as const, entity })),
	]

	const recent = takeMostRecent(entities, limit)

	return recent.map(({ kind, entity }) => {
		if (kind === 'board') return boardToSearchItem(entity)
		if (kind === 'note') return noteToSearchItem(entity)
		return taskToSearchItem(
			entity,
			columnsCollection.get(entity.columnId)?.boardId,
		)
	})
}

const takeMostRecent = (
	items: RecentEntity[],
	limit: number,
): RecentEntity[] => {
	return [...items]
		.sort((a, b) => b.entity.updatedAt.localeCompare(a.entity.updatedAt))
		.slice(0, limit)
}
