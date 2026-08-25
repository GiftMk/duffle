import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { noteSchema } from '@/lib/schemas'
import { withIsoTimestamps } from '@/lib/utils'
import { withDb } from '@/server/middleware'
import { ensureCurrentUser } from '@/server/session.server'
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
		const user = await ensureCurrentUser()
		const note = await getNoteQuery(context.db, user.id, data.id)

		if (!note) return undefined
		return withIsoTimestamps(note)
	})

export const getNotesFn = createServerFn({ method: 'GET' })
	.middleware([withDb])
	.handler(async ({ context }) => {
		const user = await ensureCurrentUser()
		const rows = await getNotesQuery(context.db, user.id)
		return rows.map(withIsoTimestamps)
	})

export const createNoteFn = createServerFn({ method: 'POST' })
	.middleware([withDb])
	.validator(noteSchema.omit({ updatedAt: true, createdAt: true }))
	.handler(async ({ data, context }) => {
		const user = await ensureCurrentUser()
		return await createNoteQuery(context.db, user.id, data)
	})

export const updateNoteFn = createServerFn({ method: 'POST' })
	.middleware([withDb])
	.validator(noteSchema.pick({ id: true, markdown: true }))
	.handler(async ({ data, context }) => {
		const user = await ensureCurrentUser()
		return await updateNoteQuery(context.db, user.id, data)
	})

export const deleteNoteFn = createServerFn({ method: 'POST' })
	.middleware([withDb])
	.validator(noteSchema.pick({ id: true }))
	.handler(async ({ data, context }) => {
		const user = await ensureCurrentUser()
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
		const user = await ensureCurrentUser()
		return await searchQuery(context.db, user.id, data.query, data.limit)
	})
