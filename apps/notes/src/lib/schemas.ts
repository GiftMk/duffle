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
