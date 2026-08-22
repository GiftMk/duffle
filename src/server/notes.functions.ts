import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { noteSchema } from '@/lib/schemas'
import { withIsoTimestamps } from '@/lib/utils'
import { withDb } from '@/server/middleware'
import { requireSession } from '@/server/session.server'
import {
	createNoteQuery,
	deleteNoteQuery,
	getNotesQuery,
	searchQuery,
	updateNoteQuery,
} from './notes.server'

export const getNotesFn = createServerFn({ method: 'GET' })
	.middleware([withDb])
	.handler(async ({ context }) => {
		const { user } = await requireSession()
		const rows = await getNotesQuery(context.db, user.id)
		return rows.map(withIsoTimestamps)
	})

export const createNoteFn = createServerFn({ method: 'POST' })
	.middleware([withDb])
	.validator(noteSchema)
	.handler(async ({ data, context }) => {
		const { user } = await requireSession()
		return await createNoteQuery(context.db, user.id, data)
	})

export const updateNoteFn = createServerFn({ method: 'POST' })
	.middleware([withDb])
	.validator(noteSchema)
	.handler(async ({ data, context }) => {
		const { user } = await requireSession()
		return await updateNoteQuery(context.db, user.id, data)
	})

export const deleteNoteFn = createServerFn({ method: 'POST' })
	.middleware([withDb])
	.validator(noteSchema.pick({ id: true }))
	.handler(async ({ data, context }) => {
		const { user } = await requireSession()
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
		const { user } = await requireSession()
		return await searchQuery(context.db, user.id, data.query, data.limit)
	})
