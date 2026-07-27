import { type Remote, wrap } from 'comlink'
import type { SearchWorker } from './search.worker'

const createSearchWorker = (): Remote<SearchWorker> => {
	if (typeof Worker === 'undefined') {
		// SSR: there's no Worker global on the server, and search only ever
		// runs client-side, so hand back a no-op stand-in instead of crashing
		// module evaluation.
		return new Proxy(
			{},
			{ get: () => async () => undefined },
		) as Remote<SearchWorker>
	}

	const worker = new Worker(new URL('./search.worker.ts', import.meta.url), {
		type: 'module',
	})
	return wrap<SearchWorker>(worker)
}

export const searchWorker = createSearchWorker()
