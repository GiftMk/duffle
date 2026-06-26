import { TypedWorker } from '.'
import type { SearchRequest, SearchResponse } from './search.worker'

export const searchWorker = new TypedWorker<SearchRequest, SearchResponse>(
	'./search.worker.ts',
)
