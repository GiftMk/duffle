import { createServerFn } from '@tanstack/react-start'
import { and, eq } from 'drizzle-orm'
import { notesTable } from '@/db/schema.notes'
import { noteSchema } from '@/lib/schemas'
import { withIsoTimestamps } from '@/lib/utils'
import { withDb } from '@/server/middleware'
import { requireSession } from '@/server/session.server'

export const getNotes = createServerFn({ method: 'GET' })
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

export const createNote = createServerFn({ method: 'POST' })
	.middleware([withDb])
	.validator(noteSchema)
	.handler(async ({ data, context }) => {
		const { user } = await requireSession()
		await context.db.insert(notesTable).values({ userId: user.id, ...data })
		return data
	})

export const updateNote = createServerFn({ method: 'POST' })
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
