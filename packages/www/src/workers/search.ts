import { wrap } from 'comlink'
import type { SearchWorker } from './search.worker'

const worker = new Worker(new URL('./search.worker.ts', import.meta.url), {
	type: 'module',
})

export const searchWorker = wrap<SearchWorker>(worker)
