import { describe, expect, it } from 'vitest'
import { createDb } from './index'
import { user } from './schema.auth'
import { notesTable } from './schema.notes'

describe('createDb (NODE_ENV=test -> in-memory PGlite)', () => {
	it('runs migrations and supports insert + select through a real FK relationship', async () => {
		const db = await createDb()

		await db.insert(user).values({
			id: 'user_1',
			name: 'Test User',
			email: 'test@example.com',
		})

		const timestamp = new Date().toISOString()

		await db.insert(notesTable).values({
			id: crypto.randomUUID(),
			userId: 'user_1',
			title: 'My Note',
			body: 'My note body',
			markdown: '# My Note\n\nMy note body',
			createdAt: timestamp,
			updatedAt: timestamp,
		})

		const notes = await db.select().from(notesTable)

		expect(notes).toHaveLength(1)
		expect(notes[0]?.title).toBe('My Note')
	})
})
