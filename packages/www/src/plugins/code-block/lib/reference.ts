export class Reference<T> {
	private _value: T

	constructor(initialValue: T) {
		this._value = initialValue
	}

	set(value: T) {
		this._value = value
	}

	get value(): T {
		return this._value
	}
}
