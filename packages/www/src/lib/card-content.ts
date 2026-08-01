import { stripMarkdown } from './utils'

// Matches the first ATX heading line ("# Title", "## Title #optional-close").
const HEADING_PATTERN = /^#{1,6}[ \t]+(.+?)\s*#*\s*$/m
const SENTENCE_END_PATTERN = /[.!?](?:\s|$)/

// Derives a card's title/description from the markdown written in the card
// editor dialog: the first heading becomes the title (rest of the doc is the
// description), or - if there's no heading - the first sentence of the first
// line becomes the title and everything else is the description.
export const parseCardContent = (
	markdown: string,
): { title: string; description: string } => {
	const headingMatch = markdown.match(HEADING_PATTERN)

	if (headingMatch?.index !== undefined && headingMatch[1]) {
		const title = stripMarkdown(headingMatch[1]).trim()
		const description = (
			markdown.slice(0, headingMatch.index) +
			markdown.slice(headingMatch.index + headingMatch[0].length)
		).trim()
		return { title, description }
	}

	const firstLineMatch = markdown.match(/^[ \t]*\S.*$/m)
	if (!firstLineMatch || firstLineMatch.index === undefined) {
		return { title: '', description: '' }
	}

	const line = firstLineMatch[0]
	const lineStart = firstLineMatch.index
	const sentenceEnd = line.match(SENTENCE_END_PATTERN)
	const splitAt =
		sentenceEnd?.index !== undefined
			? sentenceEnd.index + sentenceEnd[0].length
			: line.length

	const title = stripMarkdown(line.slice(0, splitAt)).trim()
	const description = (
		markdown.slice(0, lineStart) +
		line.slice(splitAt) +
		markdown.slice(lineStart + line.length)
	).trim()

	return { title, description }
}
