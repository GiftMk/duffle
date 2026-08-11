import { SearchDialog, SearchResultItem, Sidebar } from '@duffle/ui'
import { useSession } from '@duffle/ui/auth'
import { ICON_SIZE_SM } from '@duffle/utils/constants'
import { ScrollIcon } from '@phosphor-icons/react'
import { useNavigate, useRouterState } from '@tanstack/react-router'
import { useRecentSearchResults, useSearch } from '@/hooks/search'
import type { SearchResult } from '@/lib/search.worker'
import { NotesButton } from './notes-button'

const RECENT_RESULTS_LIMIT = 3

export const AppSidebar = () => {
	const navigate = useNavigate()
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	})
	const { data: session } = useSession()
	const isAuthenticated = !!session?.user
	const isOnNotes = pathname.startsWith('/notes')

	const { query, setQuery, results, isSearching, clear } = useSearch()
	const recentResults = useRecentSearchResults(RECENT_RESULTS_LIMIT)

	const hasQuery = query.length > 0
	const items = hasQuery ? results : recentResults

	const handleSelect = (item: SearchResult) => {
		navigate({ to: '/notes/$noteId', params: { noteId: item.id } })
	}

	return (
		<Sidebar
			scopedNav={<NotesButton active={isOnNotes} disabled={!isAuthenticated} />}
			search={
				<SearchDialog
					disabled={!isAuthenticated}
					placeholder='Search notes...'
					query={query}
					onQueryChange={setQuery}
					items={items}
					isSearching={isSearching}
					getItemKey={(item) => item.id}
					onClear={clear}
					renderItem={(item, { onSelect }) => (
						<SearchResultItem
							icon={
								<ScrollIcon
									size={ICON_SIZE_SM}
									className='shrink-0 text-typography-600'
								/>
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
