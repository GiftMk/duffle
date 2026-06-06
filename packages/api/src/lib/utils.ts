import { remark } from 'remark'
import strip from 'strip-markdown'

export const stripMarkdown = (markdown: string): string => {
	return remark().use(strip).processSync(markdown).toString()
}
