import { user as usersTable } from '@/db/schema.auth'
import { notesTable } from '@/db/schema.notes'
import { utcNow } from '@/lib/utils'
import { describe, expect } from 'vitest'
import { dbTest } from '../fixtures'
import { searchQuery } from '@/server/notes.server'
import { createNote, createUser, minusDays } from '#/utils'

describe('searchQuery', () => {
	dbTest('Performs fuzzy search on titles', async ({ db }) => {
		const user = createUser()
		await db.insert(usersTable).values(user)

		const noteA = createNote(user.id, { title: 'The life of Winnie the Poo' })
		const noteB = createNote(user.id, { title: 'A markdown editor is born' })

		await db.insert(notesTable).values([noteA, noteB])

		const results = await searchQuery(db, user.id, 'winnie')

		expect(results).toHaveLength(1)
		const result = results[0]
		expect(result?.id).toBe(noteA.id)
	})

	dbTest('Only returns notes belonging to user', async ({ db }) => {
		const userA = createUser()
		const userB = createUser()
		await db.insert(usersTable).values([userA, userB])

		const noteA = createNote(userA.id, { title: 'A markdown editor is born' })
		const noteB = createNote(userB.id, { title: 'A markdown editor is born' })

		await db.insert(notesTable).values([noteA, noteB])

		const results = await searchQuery(db, userA.id, 'markdown editor')

		expect(results).toHaveLength(1)
		const result = results[0]
		expect(result?.id).toBe(noteA.id)
	})

	dbTest('Orders notes based on similarity', async ({ db }) => {
		const user = createUser()
		await db.insert(usersTable).values(user)

		const noteA = createNote(user.id, { title: 'A really cool markdown note' })
		const noteB = createNote(user.id, {
			title: 'A really awesome markdown note',
		})

		await db.insert(notesTable).values([noteA, noteB])

		const results = await searchQuery(db, user.id, 'cool markdown note')

		expect(results[0]?.id).toBe(noteA.id)
		expect(results[1]?.id).toBe(noteB.id)
	})

	dbTest(
		'When notes have same titles, orders by most recently updated',
		async ({ db }) => {
			const user = createUser()
			await db.insert(usersTable).values(user)

			const noteA = createNote(user.id, {
				title: 'A really cool markdown note',
				createdAt: minusDays(utcNow(), 10),
				updatedAt: minusDays(utcNow(), 7),
			})
			const noteB = createNote(user.id, {
				title: 'A really cool markdown note',
				createdAt: minusDays(utcNow(), 10),
				updatedAt: minusDays(utcNow(), 3),
			})

			await db.insert(notesTable).values([noteA, noteB])

			const results = await searchQuery(db, user.id, 'cool markdown note')

			expect(results[0]?.id).toBe(noteB.id)
			expect(results[1]?.id).toBe(noteA.id)
		},
	)
})
