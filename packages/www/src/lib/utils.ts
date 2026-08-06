import { type ClassValue, clsx } from 'clsx'
import { remark } from 'remark'
import strip from 'strip-markdown'
import { twMerge } from 'tailwind-merge'
import type z from 'zod'

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

export type SafeStorage<T> = {
	get: () => T | null
	set: (data: T) => void
	remove: () => void
}

export const createSafeStorage = <T>(
	storage: Storage,
	key: string,
	schema: z.ZodType<T>,
): SafeStorage<T> => {
	return {
		get: (): T | null => {
			const raw = storage.getItem(key)
			if (!raw) return null
			try {
				return schema.parse(JSON.parse(raw))
			} catch (err) {
				console.warn(
					`[ClientStorage] Invalid data found under key: "${key}"`,
					err,
				)
				return null
			}
		},
		set: (data: T): void => {
			const validated = schema.parse(data)
			storage.setItem(key, JSON.stringify(validated))
		},
		remove: (): void => {
			storage.removeItem(key)
		},
	}
}
