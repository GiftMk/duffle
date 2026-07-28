import { type ClassValue, clsx } from 'clsx'
import { remark } from 'remark'
import strip from 'strip-markdown'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs))
}

// Strip embedded data: URIs before parsing - they can be multi-MB and
// remark would otherwise re-parse the whole blob on every keystroke.
const DATA_URI_PATTERN = /data:[\w+.-]+\/[\w+.-]+;base64,[A-Za-z0-9+/=]+/g

export const stripMarkdown = (markdown: string): string => {
	const withoutDataUris = markdown.replace(DATA_URI_PATTERN, 'data:image')

	return remark().use(strip).processSync(withoutDataUris).toString()
}

export const splitMarkdown = (
	markdown: string,
): { title: string; body: string } => {
	const stripped = stripMarkdown(markdown)
	const lines = stripped.split('\n')
	const title = lines[0] ?? ''
	const body = lines.slice(1).join('\n')

	return { title, body }
}
