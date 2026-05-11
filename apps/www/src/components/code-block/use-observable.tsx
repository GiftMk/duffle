import { useSyncExternalStore } from 'react'
import type { Observable } from './observable'

export const useObservable = <T,>(value: Observable<T>) => {
	return useSyncExternalStore(
		(notify) => value.subscribe({ notify }),
		() => value.snapshot,
	)
}
