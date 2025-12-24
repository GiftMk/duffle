import { z } from 'zod'

export const entitySchema = z.object({
	id: z.uuid(),
})

export type Entity = z.infer<typeof entitySchema>

export const boardSchema = entitySchema.extend({
	title: z.string().min(1),
	columns: z.uuid().array(),
})

export type Board = z.infer<typeof boardSchema>

export const columnSchema = entitySchema.extend({
	title: z.string().min(1),
	tasks: z.uuid().array(),
})

export type Column = z.infer<typeof columnSchema>

export const taskSchema = entitySchema.extend({
	// TODO: validate the code properly, should be in XXX-<INCREMENT> format
	code: z.string().min(1),
	title: z.string().min(1),
	description: z.string().optional(),
})

export type Task = z.infer<typeof taskSchema>
