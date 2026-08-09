import { type SQL, sql } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'
import { createDb, type Database } from '@/db'
import { user } from '@/db/schema.auth'
import { boardsTable, columnsTable, tasksTable } from '@/db/schema.kanban'
import { notesTable } from '@/db/schema.notes'
import { searchNotes, searchTasks } from '@/server/search'

const now = () => new Date().toISOString()

const BOARD_ID = '00000000-0000-0000-0000-0000000b0001'
const COLUMN_ID = '00000000-0000-0000-0000-0000000c0001'

const unitVector = (position: number) => {
	const vec = new Array(512).fill(0)
	vec[position] = 1
	return vec
}

const runSql = (
	db: Database,
	query: SQL,
): Promise<{ rows: Record<string, unknown>[] }> =>
	(
		db as unknown as {
			execute(query: SQL): Promise<{ rows: Record<string, unknown>[] }>
		}
	).execute(query)

const setEmbedding = async (
	db: Database,
	table: 'notes' | 'tasks',
	id: string,
	vec: number[],
) => {
	await runSql(
		db,
		sql`UPDATE ${sql.raw(table)} SET embedding = ${JSON.stringify(vec)}::vector WHERE id = ${id}`,
	)
}

const seed = async () => {
	const db = await createDb()

	await db.insert(user).values({ id: 'user_1', name: 'Tester', email: 't@t.t' })
	await db.insert(boardsTable).values({
		id: BOARD_ID,
		userId: 'user_1',
		title: 'Work',
		createdAt: now(),
		updatedAt: now(),
	})
	await db.insert(columnsTable).values({
		id: COLUMN_ID,
		userId: 'user_1',
		boardId: BOARD_ID,
		title: 'Todo',
		position: 0,
		createdAt: now(),
		updatedAt: now(),
	})

	return db
}

describe('hybrid search', () => {
	it('surfaces a title typo via trigram', async () => {
		const db = await seed()
		await db.insert(notesTable).values({
			id: '00000000-0000-0000-0000-000000000001',
			userId: 'user_1',
			title: 'planning',
			body: '',
			markdown: 'planning',
			createdAt: now(),
			updatedAt: now(),
		})

		const results = await searchNotes(db, 'user_1', 'planing', undefined)

		expect(results).toHaveLength(1)
		expect(results[0]?.title).toBe('planning')
		expect(results[0]?.type).toBe('note')
	})

	it('surfaces a body keyword via full-text search', async () => {
		const db = await seed()
		await db.insert(notesTable).values({
			id: '00000000-0000-0000-0000-000000000002',
			userId: 'user_1',
			title: 'Recipes',
			body: 'The quick brown fox jumps over the lazy dog',
			markdown: 'The quick brown fox jumps over the lazy dog',
			createdAt: now(),
			updatedAt: now(),
		})

		const results = await searchNotes(db, 'user_1', 'fox', undefined)

		expect(results).toHaveLength(1)
		expect(results[0]?.title).toBe('Recipes')
	})

	it('surfaces a semantic-only match with no literal overlap', async () => {
		const db = await seed()
		await db.insert(notesTable).values({
			id: '00000000-0000-0000-0000-000000000003',
			userId: 'user_1',
			title: 'Carbonara',
			body: 'A creamy cheese and egg sauce over noodles.',
			markdown: 'Carbonara',
			createdAt: now(),
			updatedAt: now(),
		})
		await setEmbedding(
			db,
			'notes',
			'00000000-0000-0000-0000-000000000003',
			unitVector(0),
		)

		const results = await searchNotes(
			db,
			'user_1',
			'italian dinner ideas',
			unitVector(0),
		)

		expect(results).toHaveLength(1)
		expect(results[0]?.title).toBe('Carbonara')
	})

	it('returns task results with a boardId via the columns join', async () => {
		const db = await seed()
		await db.insert(tasksTable).values({
			id: '00000000-0000-0000-0000-000000000004',
			userId: 'user_1',
			columnId: COLUMN_ID,
			title: 'deployment',
			description: 'Set up the CI pipeline',
			position: 'a0',
			createdAt: now(),
			updatedAt: now(),
		})

		const results = await searchTasks(db, 'user_1', 'deployent', undefined)

		expect(results).toHaveLength(1)
		expect(results[0]?.type).toBe('task')
		expect(results[0]?.boardId).toBe(BOARD_ID)
	})

	it('scopes results to the requesting user', async () => {
		const db = await seed()
		await db
			.insert(user)
			.values({ id: 'user_2', name: 'Other', email: 'o@o.o' })
		await db.insert(notesTable).values({
			id: '00000000-0000-0000-0000-000000000010',
			userId: 'user_2',
			title: 'planning',
			body: '',
			markdown: 'planning',
			createdAt: now(),
			updatedAt: now(),
		})

		const results = await searchNotes(db, 'user_1', 'planning', undefined)

		expect(results).toHaveLength(0)
	})
})
