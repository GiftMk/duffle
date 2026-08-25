import { and, desc, eq, sql } from 'drizzle-orm'
import type { Database } from '@/db'
import { notesTable } from '@/db/schema.notes'
import type { NoteEntity } from '@/lib/schemas'
import { splitMarkdown, utcNow } from '@/lib/utils'

const noteProjection = () => ({
	id: notesTable.id,
	title: notesTable.title,
	body: notesTable.body,
	markdown: notesTable.markdown,
	createdAt: notesTable.createdAt,
	updatedAt: notesTable.updatedAt,
})

export const getNoteQuery = async (
	db: Database,
	userId: string,
	noteId: string,
) => {
	const [note] = await db
		.select(noteProjection())
		.from(notesTable)
		.where(and(eq(notesTable.userId, userId), eq(notesTable.id, noteId)))
		.orderBy(desc(notesTable.updatedAt))

	return note
}

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
	note: Omit<NoteEntity, 'updatedAt' | 'createdAt'>,
) => {
	const now = utcNow()
	const [row] = await db
		.insert(notesTable)
		.values({ userId, ...note, updatedAt: now, createdAt: now })
		.returning()

	return row
}

export const updateNoteQuery = async (
	db: Database,
	userId: string,
	note: Pick<NoteEntity, 'id' | 'markdown'>,
) => {
	const { title, body } = splitMarkdown(note.markdown)
	const [row] = await db
		.update(notesTable)
		.set({ ...note, updatedAt: utcNow(), title: title ?? '', body: body ?? '' })
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

export const reassignNotesQuery = async (
	db: Database,
	fromUserId: string,
	toUserId: string,
) => {
	await db
		.update(notesTable)
		.set({ userId: toUserId })
		.where(eq(notesTable.userId, fromUserId))
}

export const deleteNotesForUserQuery = async (db: Database, userId: string) => {
	await db.delete(notesTable).where(eq(notesTable.userId, userId))
}

// Reciprocal rank fusion constant. Controls how quickly a match's influence
// decays as its rank within a branch gets worse; 60 is the commonly cited
// default from the original RRF paper.
const RRF_K = 60

export const searchQuery = async (
	db: Database,
	userId: string,
	query: string,
	limit = 10,
) => {
	const titleMatches = db.$with('title_matches').as(
		db
			.select({
				id: notesTable.id,
				rank: sql`row_number() over (order by ${notesTable.title} <-> ${query}, ${notesTable.updatedAt} desc)`.as(
					'rank',
				),
			})
			.from(notesTable)
			.where(
				and(eq(notesTable.userId, userId), sql`${notesTable.title} % ${query}`),
			),
	)

	const bodyMatches = db.$with('body_matches').as(
		db
			.select({
				id: notesTable.id,
				rank: sql`row_number() over (order by ts_rank_cd(to_tsvector('english', ${notesTable.body}), websearch_to_tsquery('english', ${query})) desc, ${notesTable.updatedAt} desc)`.as(
					'rank',
				),
			})
			.from(notesTable)
			.where(
				and(
					eq(notesTable.userId, userId),
					sql`to_tsvector('english', ${notesTable.body}) @@ websearch_to_tsquery('english', ${query})`,
				),
			),
	)

	const fused = db.$with('fused').as(
		db
			.select({
				id: sql`coalesce(${titleMatches.id}, ${bodyMatches.id})`.as('id'),
				score:
					sql`coalesce(1.0 / (${RRF_K} + ${titleMatches.rank}), 0) + coalesce(1.0 / (${RRF_K} + ${bodyMatches.rank}), 0)`.as(
						'score',
					),
			})
			.from(titleMatches)
			.fullJoin(bodyMatches, eq(titleMatches.id, bodyMatches.id)),
	)

	return await db
		.with(titleMatches, bodyMatches, fused)
		.select(noteProjection())
		.from(fused)
		.innerJoin(notesTable, eq(notesTable.id, fused.id))
		.orderBy(desc(fused.score), desc(notesTable.updatedAt))
		.limit(limit)
}
