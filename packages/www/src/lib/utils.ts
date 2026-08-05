import { type ClassValue, clsx } from 'clsx'
import { remark } from 'remark'
import strip from 'strip-markdown'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs))
}

const DATA_URI_PATTERN = /data:[\w+.-]+\/[\w+.-]+;base64,[A-Za-z0-9+/=]+/g

export const stripMarkdown = (markdown: string): string => {
	// replacing images with placeholder to improve remark parse performance
	const withoutDataUris = markdown.replace(DATA_URI_PATTERN, 'data:image')

	return remark().use(strip).processSync(withoutDataUris).toString()
}

export const splitMarkdown = (
	markdown: string,
): { title?: string; description?: string } => {
	const stripped = stripMarkdown(markdown)
	const lines = stripped.split('\n')
	const title = lines[0]?.trim() || undefined
	const description =
		lines
			.slice(1)
			.map((line) => line.trim())
			.join('\n') || undefined

	return { title, description }
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
