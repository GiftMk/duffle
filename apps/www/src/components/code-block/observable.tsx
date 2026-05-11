type Subscriber = {
	notify: () => void
}

export class Observable<T> {
	private current: T
	private readonly subscribers: Subscriber[] = []

	constructor(value: T) {
		this.current = value
	}

	get snapshot(): T {
		return this.current
	}

	subscribe(subscriber: Subscriber) {
		this.subscribers.push(subscriber)

		return () => {
			this.subscribers.filter((s) => s !== subscriber)
		}
	}

	update(value: T) {
		this.current = value
		this.notifySubscribers()
	}

	private notifySubscribers() {
		for (const subscriber of this.subscribers) {
			subscriber.notify()
		}
	}
}
