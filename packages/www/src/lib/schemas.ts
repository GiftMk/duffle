import { z } from 'zod'

export const boardSchema = z.object({
	id: z.uuidv7(),
	title: z.string().min(1),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
})

export type BoardEntity = z.infer<typeof boardSchema>

export const columnSchema = z.object({
	id: z.uuidv7(),
	title: z.string().min(1),
	boardId: z.uuid(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
	position: z.number(),
})

export type ColumnEntity = z.infer<typeof columnSchema>

export const taskSchema = z.object({
	id: z.uuidv7(),
	title: z.string().min(1),
	columnId: z.uuid(),
	description: z.string().optional(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
	position: z.number(),
})

export type TaskEntity = z.infer<typeof taskSchema>

export const noteSchema = z.object({
	id: z.uuidv7(),
	title: z.string(),
	body: z.string(),
	markdown: z.string(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
})

export type NoteEntity = z.infer<typeof noteSchema>
