import { tool } from 'ai'
import { z } from 'zod'
import type { Database } from '@/db'
import type { NoteEntity } from '@/lib/schemas'
import { getRecentNotesQuery } from '@/server/notes.server'

type RecentNotesToolOptions = {
	db: Database
	userId: string
}

type RecentNoteForTool = {
	id: string
	title: string
	updatedAt: string
	markdown: string
}

export const toToolNote = (
	note: Pick<NoteEntity, 'id' | 'title' | 'updatedAt' | 'markdown'>,
): RecentNoteForTool => ({
	id: note.id,
	title: note.title || 'Untitled',
	updatedAt: note.updatedAt,
	markdown: note.markdown,
})

export const createRecentNotesTool = ({ db, userId }: RecentNotesToolOptions) =>
	tool({
		description:
			"Read the user's 20 most recently edited notes. Call this before answering anything about what the user has written.",
		inputSchema: z.object({}),
		execute: async () => {
			const notes = await getRecentNotesQuery(db, userId)
			return { notes: notes.map(toToolNote) }
		},
	})
