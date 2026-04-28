import { z } from 'zod'

export const documentSchema = z.object({
	id: z.string(),
	markdown: z.string(),
})

export type Document = z.infer<typeof documentSchema>
