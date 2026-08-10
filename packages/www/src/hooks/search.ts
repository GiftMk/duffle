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
import type { SidebarContext } from '@/lib/utils'

const matchesScope = (result: SearchResult, scope?: SidebarContext) => {
	if (!scope) return true
	if (scope === 'notes') return result.type === 'note'
	return result.type === 'board' || result.type === 'task'
}

export const useSearch = (scope?: SidebarContext) => {
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
			setResults(queryResults.filter((result) => matchesScope(result, scope)))
			setIsSearching(false)
		})
	}, [query, scope])

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

export const useRecentSearchResults = (
	limit: number,
	scope?: SidebarContext,
): SearchResult[] => {
	const boards = useBoards()
	const notes = useNotes()
	const tasks = useAllTasks()

	const entities: RecentEntity[] = []

	if (scope === 'notes') {
		notes
			.map((entity) => ({ kind: 'note' as const, entity }))
			.forEach((entity) => {
				entities.push(entity)
			})
	} else {
		boards
			.map((entity) => ({ kind: 'board' as const, entity }))
			.forEach((entity) => {
				entities.push(entity)
			})
		tasks
			.map((entity) => ({ kind: 'task' as const, entity }))
			.forEach((entity) => {
				entities.push(entity)
			})
	}

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
