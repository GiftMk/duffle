import { type ClassValue, clsx } from 'clsx'
import type { Ref } from 'react'
import { remark } from 'remark'
import strip from 'strip-markdown'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs))
}

export const stripMarkdown = (markdown: string): string => {
	return remark().use(strip).processSync(markdown).toString()
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

export const mergeRefs = (...refs: Ref<unknown>[]) => {
	return (node: unknown) => {
		for (const ref of refs) {
			if (!ref) {
				continue
			}

			if (typeof ref === 'function') {
				ref(node)
			} else {
				ref.current = node
			}
		}
	}
}
