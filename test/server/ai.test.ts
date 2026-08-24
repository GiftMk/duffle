import { describe, expect, it } from 'vitest'
import { toToolNote } from '@/server/ai/tools'

describe('toToolNote', () => {
	it('falls back to Untitled when the note has no title', () => {
		const note = toToolNote({
			id: '1',
			title: '',
			updatedAt: '2026-01-01T00:00:00.000Z',
			markdown: '# \nSome content',
		})

		expect(note.title).toBe('Untitled')
	})

	it('keeps a real title as-is', () => {
		const note = toToolNote({
			id: '1',
			title: 'Grocery list',
			updatedAt: '2026-01-01T00:00:00.000Z',
			markdown: '# Grocery list\nMilk, eggs',
		})

		expect(note.title).toBe('Grocery list')
	})

	it('passes markdown through untouched', () => {
		const markdown =
			'# Title\nSome **bold** content and a [link](https://x.com)'

		const note = toToolNote({
			id: '1',
			title: 'Title',
			updatedAt: '2026-01-01T00:00:00.000Z',
			markdown,
		})

		expect(note.markdown).toBe(markdown)
	})
})
