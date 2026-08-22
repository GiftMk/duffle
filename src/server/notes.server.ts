import { and, desc, eq, sql } from 'drizzle-orm'
import type { Database } from '@/db'
import { notesTable } from '@/db/schema.notes'
import type { NoteEntity } from '@/lib/schemas'

const noteProjection = () => ({
	id: notesTable.id,
	title: notesTable.title,
	body: notesTable.body,
	markdown: notesTable.markdown,
	createdAt: notesTable.createdAt,
	updatedAt: notesTable.updatedAt,
})

export const getNotesQuery = async (db: Database, userId: string) => {
	return await db
		.select(noteProjection())
		.from(notesTable)
		.where(eq(notesTable.userId, userId))
		.orderBy(desc(notesTable.updatedAt))
}

export const createNoteQuery = async (
	db: Database,
	userId: string,
	note: NoteEntity,
) => {
	const [row] = await db
		.insert(notesTable)
		.values({ userId, ...note })
		.returning()

	return row
}

export const updateNoteQuery = async (
	db: Database,
	userId: string,
	note: Partial<NoteEntity> & Pick<NoteEntity, 'id'>,
) => {
	const [row] = await db
		.update(notesTable)
		.set(note)
		.where(and(eq(notesTable.userId, userId), eq(notesTable.id, note.id)))
		.returning()

	return row
}

export const deleteNoteQuery = async (
	db: Database,
	userId: string,
	id: string,
) => {
	const [row] = await db
		.delete(notesTable)
		.where(and(eq(notesTable.userId, userId), eq(notesTable.id, id)))
		.returning()

	return row
}

export const searchQuery = async (
	db: Database,
	userId: string,
	query: string,
	limit = 10,
) => {
	return await db
		.select(noteProjection())
		.from(notesTable)
		.where(
			and(eq(notesTable.userId, userId), sql`${notesTable.title} % ${query}`),
		)
		.orderBy(sql`${notesTable.title} <-> ${query}`, desc(notesTable.updatedAt))
		.limit(limit)
}
