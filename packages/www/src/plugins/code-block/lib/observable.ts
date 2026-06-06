type Subscriber = {
	notify: () => void
}
type UnsubscribeCallback = () => void

export interface Observable<T> {
	get: () => T
	set: (value: T) => void
	subscribe: (subscriber: Subscriber) => UnsubscribeCallback
}

class DefaultObservable<T> implements Observable<T> {
	private value: T
	private readonly subscribers: Subscriber[] = []

	constructor(value: T) {
		this.value = value
	}

	get() {
		return this.value
	}

	set(value: T) {
		this.value = value

		for (const subscriber of this.subscribers) {
			subscriber.notify()
		}
	}

	subscribe(subscriber: Subscriber): UnsubscribeCallback {
		const length = this.subscribers.push(subscriber)

		return () => {
			return this.subscribers.splice(length - 1, 1)
		}
	}
}

export const observable = <T>(value: T): Observable<T> => {
	return new DefaultObservable(value)
}
