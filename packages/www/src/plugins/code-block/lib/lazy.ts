export class Lazy<T> {
	private _value: T | null = null

	get hasValue(): boolean {
		return this._value !== null
	}

	get value(): T {
		if (!this._value) {
			throw new Error('Lazy value is not set')
		}

		return this._value
	}

	set(value: T) {
		if (this._value) {
			return
		}

		this._value = value
	}
}
