import { useEffect, useState } from 'react'
import { useBoards } from '@/hooks/boards'
import { useAllTasks } from '@/hooks/tasks'
import { columnsCollection } from '@/lib/collections'
import type { BoardEntity, TaskEntity } from '@/lib/schemas'
import { boardToSearchItem, searchWorker, taskToSearchItem } from '@/lib/search'
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
	| { kind: 'task'; entity: TaskEntity }

export const useRecentSearchResults = (limit: number): SearchResult[] => {
	const boards = useBoards()
	const tasks = useAllTasks()

	const entities: RecentEntity[] = [
		...boards.map((entity) => ({ kind: 'board' as const, entity })),
		...tasks.map((entity) => ({ kind: 'task' as const, entity })),
	]

	const recent = takeMostRecent(entities, limit)

	return recent.map(({ kind, entity }) => {
		if (kind === 'board') return boardToSearchItem(entity)
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
