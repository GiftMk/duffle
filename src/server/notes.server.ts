import type { Database } from '@/db'
import { notesTable } from '@/db/schema.notes'
import { and, desc, eq, sql } from 'drizzle-orm'

export const searchQuery = async (
	db: Database,
	userId: string,
	query: string,
	limit = 10,
) => {
	return await db
		.select({
			id: notesTable.id,
			title: notesTable.title,
			body: notesTable.body,
			markdown: notesTable.markdown,
		})
		.from(notesTable)
		.where(
			and(eq(notesTable.userId, userId), sql`${notesTable.title} % ${query}`),
		)
		.orderBy(sql`${notesTable.title} <-> ${query}`, desc(notesTable.updatedAt))
		.limit(limit)
}
