import { useSyncExternalStore } from 'react'
import type { Observable } from '../lib/observable.ts'

export const useObservable = <T,>(observable: Observable<T>) => {
	return useSyncExternalStore(
		(onStoreChange) => observable.subscribe({ notify: onStoreChange }),
		() => observable.get(),
	)
}
