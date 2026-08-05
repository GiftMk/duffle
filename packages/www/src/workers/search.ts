import { type Remote, wrap } from 'comlink'
import type { SearchWorker } from './search.worker'

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
