import { type ClassValue, clsx } from 'clsx'
import { remark } from 'remark'
import strip from 'strip-markdown'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs))
}

export const utcNow = () => new Date().toISOString()

export const onNextTick = (callback: () => void) => setTimeout(callback, 0)

export const debounce = <Args extends unknown[]>(
	fn: (...args: Args) => void,
	wait: number,
): ((...args: Args) => void) => {
	let timeout: ReturnType<typeof setTimeout> | undefined
	return (...args: Args) => {
		clearTimeout(timeout)
		timeout = setTimeout(() => fn(...args), wait)
	}
}

export const chunk = <T>(items: readonly T[], size: number): T[][] => {
	const chunks: T[][] = []
	for (let index = 0; index < items.length; index += size) {
		chunks.push(items.slice(index, index + size))
	}
	return chunks
}

export const clamp = (value: number, min: number, max: number): number => {
	return Math.min(Math.max(value, min), max)
}

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
