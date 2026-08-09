import { createServerFn } from '@tanstack/react-start'
import { and, eq } from 'drizzle-orm'
import type { Database } from '@/db'
import { notesTable } from '@/db/schema.notes'
import { type NoteEntity, noteSchema } from '@/lib/schemas'
import { withIsoTimestamps } from '@/lib/utils'
import { generateEmbedding } from '@/server/embeddings'
import { withDb } from '@/server/middleware'
import { requireSession } from '@/server/session.server'

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
		await persistEmbedding(context.db, user.id, data)
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

		await persistEmbedding(context.db, user.id, data)
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

const persistEmbedding = async (
	db: Database,
	userId: string,
	note: NoteEntity,
) => {
	try {
		const embedding = await generateEmbedding(note.title, note.body)
		await db
			.update(notesTable)
			.set({ embedding })
			.where(and(eq(notesTable.userId, userId), eq(notesTable.id, note.id)))
	} catch (error) {
		console.error(`Failed to persist embedding for note ${note.id}`, error)
	}
}
