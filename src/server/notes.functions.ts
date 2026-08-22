import { createServerFn } from '@tanstack/react-start'
import { and, eq } from 'drizzle-orm'
import { notesTable } from '@/db/schema.notes'
import { noteSchema } from '@/lib/schemas'
import { withIsoTimestamps } from '@/lib/utils'
import { withDb } from '@/server/middleware'
import { requireSession } from '@/server/session.server'
import z from 'zod'
import { searchQuery } from './notes.server'

export const getNotesFn = createServerFn({ method: 'GET' })
	.middleware([withDb])
	.handler(async ({ context }) => {
		const { user } = await requireSession()

		const rows = await context.db
			.select({
				id: notesTable.id,
				title: notesTable.title,
				body: notesTable.body,
				markdown: notesTable.markdown,
				createdAt: notesTable.createdAt,
				updatedAt: notesTable.updatedAt,
			})
			.from(notesTable)
			.where(eq(notesTable.userId, user.id))

		return rows.map(withIsoTimestamps)
	})

export const createNoteFn = createServerFn({ method: 'POST' })
	.middleware([withDb])
	.validator(noteSchema)
	.handler(async ({ data, context }) => {
		const { user } = await requireSession()
		await context.db.insert(notesTable).values({ userId: user.id, ...data })
		return data
	})

export const updateNoteFn = createServerFn({ method: 'POST' })
	.middleware([withDb])
	.validator(noteSchema)
	.handler(async ({ data, context }) => {
		const { user } = await requireSession()

		await context.db
			.update(notesTable)
			.set(data)
			.where(and(eq(notesTable.userId, user.id), eq(notesTable.id, data.id)))

		return data
	})

export const deleteNoteFn = createServerFn({ method: 'POST' })
	.middleware([withDb])
	.validator(noteSchema.pick({ id: true }))
	.handler(async ({ data, context }) => {
		const { user } = await requireSession()

		await context.db
			.delete(notesTable)
			.where(and(eq(notesTable.userId, user.id), eq(notesTable.id, data.id)))

		return { id: data.id }
	})

const searchSchema = z.object({
	query: z.string().nonempty(),
	limit: z.number().positive(),
})

export const searchFn = createServerFn({ method: 'GET' })
	.middleware([withDb])
	.validator(searchSchema)
	.handler(async ({ data, context }) => {
		const { user } = await requireSession()
		return await searchQuery(context.db, user.id, data.query, data.limit)
	})
