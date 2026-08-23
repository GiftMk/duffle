import { describe, expect, it, vi } from 'vitest'
import { computeGridColumns, getSearchState } from '@/hooks/search'

// getSearchState/computeGridColumns share a module with useSearch, which
// imports server functions that eagerly connect to a database at import
// time outside of the app's dev server. Stub them out so this file can
// test the pure helpers without a real database.
vi.mock('@/server/notes.functions', () => ({
	searchFn: vi.fn(),
	updateNoteFn: vi.fn(),
}))

describe('getSearchState', () => {
	it('shows recents when there is no query', () => {
		const state = getSearchState({
			hasQuery: false,
			isSearching: false,
			resultCount: 0,
		})

		expect(state).toBe('recent')
	})

	it('shows recents while a query is present but recents are still backing the grid', () => {
		const state = getSearchState({
			hasQuery: false,
			isSearching: true,
			resultCount: 3,
		})

		expect(state).toBe('recent')
	})

	it('prefers stale results over a loading state so the grid never empties out', () => {
		const state = getSearchState({
			hasQuery: true,
			isSearching: true,
			resultCount: 5,
		})

		expect(state).toBe('results')
	})

	it('shows loading only once there are truly no results to keep showing', () => {
		const state = getSearchState({
			hasQuery: true,
			isSearching: true,
			resultCount: 0,
		})

		expect(state).toBe('loading')
	})

	it('shows empty once the search has settled with no matches', () => {
		const state = getSearchState({
			hasQuery: true,
			isSearching: false,
			resultCount: 0,
		})

		expect(state).toBe('empty')
	})
})

const OPTIONS = { minCardWidth: 260, gap: 24, maxColumns: 5 }

describe('computeGridColumns', () => {
	it('returns 1 column while the width has not been measured yet', () => {
		expect(computeGridColumns(0, OPTIONS)).toBe(1)
	})

	it('fits as many columns as the width allows', () => {
		// 3 cards + 2 gaps = 3 * 260 + 2 * 24 = 828
		expect(computeGridColumns(828, OPTIONS)).toBe(3)
	})

	it('never exceeds maxColumns even when the width is huge', () => {
		expect(computeGridColumns(10_000, OPTIONS)).toBe(5)
	})

	it('never goes below 1 column even when the width is tiny', () => {
		expect(computeGridColumns(50, OPTIONS)).toBe(1)
	})
})
