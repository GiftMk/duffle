import { type ClassValue, clsx } from 'clsx'
import { remark } from 'remark'
import strip from 'strip-markdown'
import { twMerge } from 'tailwind-merge'
import { uuidv7 } from 'uuidv7'

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs))
}

export const utcNow = () => new Date().toISOString()

export const onNextTick = (callback: () => void) => setTimeout(callback, 0)

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
): { title?: string; body?: string } => {
	const stripped = stripMarkdown(markdown)
	const lines = stripped.split('\n')
	const title = lines[0]?.trim() || undefined
	const body =
		lines
			.slice(1)
			.map((line) => line.trim())
			.join('\n') || undefined

	return { title, body }
}

export const emptyNote = () => ({
	id: uuidv7(),
	title: '',
	body: '',
	markdown: '# ',
})
