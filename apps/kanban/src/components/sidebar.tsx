import { SearchDialog, SearchResultItem, Sidebar } from '@duffle/ui'
import { useSession } from '@duffle/ui/auth'
import { ICON_SIZE_SM } from '@duffle/utils/constants'
import { CheckSquareOffsetIcon, KanbanIcon } from '@phosphor-icons/react'
import { useNavigate, useRouterState } from '@tanstack/react-router'
import { useRecentSearchResults, useSearch } from '@/hooks/search'
import type { SearchResult } from '@/lib/search.worker'
import { BoardsButton } from './boards-button'

const RECENT_RESULTS_LIMIT = 3

export const AppSidebar = () => {
	const navigate = useNavigate()
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	})
	const { data: session } = useSession()
	const isAuthenticated = !!session?.user
	const isOnBoards = pathname.startsWith('/boards')

	const { query, setQuery, results, isSearching, clear } = useSearch()
	const recentResults = useRecentSearchResults(RECENT_RESULTS_LIMIT)

	const hasQuery = query.length > 0
	const items = hasQuery ? results : recentResults

	const handleSelect = (item: SearchResult) => {
		if (item.boardId) {
			navigate({ to: '/boards/$boardId', params: { boardId: item.boardId } })
		}
	}

	return (
		<Sidebar
			scopedNav={
				<BoardsButton active={isOnBoards} disabled={!isAuthenticated} />
			}
			search={
				<SearchDialog
					disabled={!isAuthenticated}
					placeholder='Search boards and tasks...'
					query={query}
					onQueryChange={setQuery}
					items={items}
					isSearching={isSearching}
					getItemKey={(item) => item.id}
					onClear={clear}
					renderItem={(item, { onSelect }) => (
						<SearchResultItem
							icon={
								item.type === 'task' ? (
									<CheckSquareOffsetIcon
										size={ICON_SIZE_SM}
										className='shrink-0 text-typography-600'
									/>
								) : (
									<KanbanIcon
										size={ICON_SIZE_SM}
										className='shrink-0 text-typography-600'
									/>
								)
							}
							title={item.title}
							onClick={() => {
								onSelect()
								handleSelect(item)
							}}
						/>
					)}
				/>
			}
		/>
	)
}
