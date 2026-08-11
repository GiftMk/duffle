import { describe, expect, it } from 'vitest'
import { createDb } from './index'
import { user } from './schema.auth'
import { boardsTable } from './schema.kanban'

describe('createDb (NODE_ENV=test -> in-memory PGlite)', () => {
	it('runs migrations and supports insert + select through a real FK relationship', async () => {
		const db = await createDb()

		await db.insert(user).values({
			id: 'user_1',
			name: 'Test User',
			email: 'test@example.com',
		})

		await db.insert(boardsTable).values({
			id: crypto.randomUUID(),
			userId: 'user_1',
			title: 'My Board',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		})

		const boards = await db.select().from(boardsTable)

		expect(boards).toHaveLength(1)
		expect(boards[0]?.title).toBe('My Board')
	})
})
