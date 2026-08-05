import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs))
}

export const onNextTick = (callback: () => void) => {
	return setTimeout(callback, 0)
}

export const utcNow = () => new Date().toISOString()

export const withIsoTimestamps = <
	T extends { createdAt: string; updatedAt: string },
>(
	row: T,
): T => ({
	...row,
	createdAt: new Date(row.createdAt).toISOString(),
	updatedAt: new Date(row.updatedAt).toISOString(),
})

export const queryable = <T>(iterator: IterableIterator<T>) =>
	new Queryable(iterator)

class Queryable<T> {
	private iterator: IterableIterator<T>

	constructor(iterator: IterableIterator<T>) {
		this.iterator = iterator
	}

	filter(predicate: (item: T) => boolean) {
		const items: T[] = []

		for (const item of this.iterator) {
			if (predicate(item)) items.push(item)
		}

		return new Queryable(items.values())
	}

	first(predicate: (item: T) => boolean) {
		for (const item of this.iterator) {
			if (predicate(item)) return item
		}
	}

	max(comparator: (item: T) => number) {
		let greatest: T | undefined

		for (const item of this.iterator) {
			if (greatest === undefined || comparator(item) > comparator(greatest)) {
				greatest = item
			}
		}

		return greatest
	}
}
