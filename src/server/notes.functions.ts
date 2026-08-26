import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { noteSchema } from '@/lib/schemas'
import { withIsoTimestamps } from '@/lib/utils'
import { getCurrentUser } from '@/server/auth.server'
import { withDb } from '@/server/middleware'
import {
	createNoteQuery,
	deleteNoteQuery,
	getNoteQuery,
	getNotesQuery,
	searchQuery,
	updateNoteQuery,
} from './notes.server'

export const getNoteFn = createServerFn({ method: 'GET' })
	.middleware([withDb])
	.validator(noteSchema.pick({ id: true }))
	.handler(async ({ data, context }) => {
		const user = await getCurrentUser()
		const note = await getNoteQuery(context.db, user.id, data.id)

		if (!note) return undefined
		return withIsoTimestamps(note)
	})

export const getNotesFn = createServerFn({ method: 'GET' })
	.middleware([withDb])
	.handler(async ({ context }) => {
		const user = await getCurrentUser()
		const rows = await getNotesQuery(context.db, user.id)
		return rows.map(withIsoTimestamps)
	})

export const getLatestNoteFn = createServerFn({ method: 'GET' })
	.middleware([withDb])
	.handler(async ({ context }) => {
		const user = await getCurrentUser()
		const [row] = await getNotesQuery(context.db, user.id, 1)
		return row ? withIsoTimestamps(row) : undefined
	})

export const createNoteFn = createServerFn({ method: 'POST' })
	.middleware([withDb])
	.validator(noteSchema.omit({ updatedAt: true, createdAt: true }))
	.handler(async ({ data, context }) => {
		const user = await getCurrentUser()
		return await createNoteQuery(context.db, user.id, data)
	})

export const updateNoteFn = createServerFn({ method: 'POST' })
	.middleware([withDb])
	.validator(noteSchema.pick({ id: true, markdown: true }))
	.handler(async ({ data, context }) => {
		const user = await getCurrentUser()
		return await updateNoteQuery(context.db, user.id, data)
	})

export const deleteNoteFn = createServerFn({ method: 'POST' })
	.middleware([withDb])
	.validator(noteSchema.pick({ id: true }))
	.handler(async ({ data, context }) => {
		const user = await getCurrentUser()
		await deleteNoteQuery(context.db, user.id, data.id)
		return { id: data.id }
	})

const searchSchema = z.object({
	query: z.string().nonempty(),
	limit: z.number().positive().optional(),
})

export const searchFn = createServerFn({ method: 'GET' })
	.middleware([withDb])
	.validator(searchSchema)
	.handler(async ({ data, context }) => {
		const user = await getCurrentUser()
		return await searchQuery(context.db, user.id, data.query, data.limit)
	})
