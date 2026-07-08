import { TypedWorker } from '.'
import type { SearchRequest, SearchResponse } from './search.worker'

export const searchWorker = new TypedWorker<SearchRequest, SearchResponse>(
	new Worker(new URL('./search.worker.ts', import.meta.url), {
		type: 'module',
	}),
)
