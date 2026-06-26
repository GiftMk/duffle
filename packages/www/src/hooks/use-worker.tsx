import type { TypedWorker } from '@/workers'
import { useEffect } from 'react'

export const useWorker = <T, U>(
	worker: TypedWorker<T, U>,
	callback: (response: U) => void,
) => {
	useEffect(() => {
		const unsubscribe = worker.subscribe(callback)
		return () => unsubscribe()
	}, [worker, callback])
}
