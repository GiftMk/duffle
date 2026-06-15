import { remark } from 'remark'
import strip from 'strip-markdown'
import type { Document, DocumentEntity } from './types'

export const stripMd = (markdown: string): string => {
	return remark().use(strip).processSync(markdown).toString()
}

export const toModel = (
	document: Omit<DocumentEntity, 'text' | 'searchVector'>,
): Document => ({
	id: document.id,
	markdown: document.markdown,
	createdAt: document.createdAt,
	updatedAt: document.updatedAt,
})
