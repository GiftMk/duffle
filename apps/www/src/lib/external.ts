export type External<T> = {
	get: () => T
	set: (value: T) => void
}
