export class TypedWorker<T, U> {
	private readonly worker

	constructor(path: string) {
		this.worker = new Worker(new URL(path, import.meta.url), { type: 'module' })
	}

	send(request: T) {
		this.worker.postMessage(request)
	}

	subscribe(callback: (response: U) => void) {
		const handler = (e: MessageEvent) => {
			callback(e.data)
		}
		this.worker.addEventListener('message', handler)

		return () => this.worker.removeEventListener('message', handler)
	}
}
