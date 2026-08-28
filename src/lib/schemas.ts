import { z } from 'zod'

export const noteSchema = z.object({
	id: z.uuidv7(),
	title: z.string(),
	body: z.string(),
	markdown: z.string(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
})

export type NoteEntity = z.infer<typeof noteSchema>

export const noteSummarySchema = noteSchema.pick({
	id: true,
	title: true,
	createdAt: true,
	updatedAt: true,
})

export type NoteSummary = z.infer<typeof noteSummarySchema>
