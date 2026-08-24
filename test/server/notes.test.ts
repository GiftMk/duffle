import { eq } from 'drizzle-orm'
import { describe, expect } from 'vitest'
import { createNote, createUser, minusDays } from '#/utils'
import { user as usersTable } from '@/db/schema.auth'
import { notesTable } from '@/db/schema.notes'
import { utcNow } from '@/lib/utils'
import {
	createNoteQuery,
	deleteNoteQuery,
	deleteNotesForUserQuery,
	getNotesQuery,
	reassignNotesQuery,
	searchQuery,
	updateNoteQuery,
} from '@/server/notes.server'
import { dbTest } from '../fixtures'

describe('getNotesQuery', () => {
	dbTest('Only returns notes belonging to the user', async ({ db }) => {
		const userA = createUser()
		const userB = createUser()
		await db.insert(usersTable).values([userA, userB])

		const noteA = createNote(userA.id, { title: 'Notes for user A' })
		const noteB = createNote(userB.id, { title: 'Notes for user B' })

		await db.insert(notesTable).values([noteA, noteB])

		const results = await getNotesQuery(db, userA.id)

		expect(results).toHaveLength(1)
		const result = results[0]
		expect(result?.id).toBe(noteA.id)
	})

	dbTest('Orders notes by most recently updated', async ({ db }) => {
		const user = createUser()
		await db.insert(usersTable).values(user)

		const noteA = createNote(user.id, {
			title: 'Older note',
			updatedAt: minusDays(utcNow(), 7),
		})
		const noteB = createNote(user.id, {
			title: 'Newer note',
			updatedAt: minusDays(utcNow(), 3),
		})

		await db.insert(notesTable).values([noteA, noteB])

		const results = await getNotesQuery(db, user.id)

		expect(results[0]?.id).toBe(noteB.id)
		expect(results[1]?.id).toBe(noteA.id)
	})
})

describe('createNoteQuery', () => {
	dbTest('Created note is assigned to user', async ({ db }) => {
		const user = createUser()
		await db.insert(usersTable).values(user)

		const note = createNote(user.id, { title: 'A new note' })

		const result = await createNoteQuery(db, user.id, note)

		expect(result?.userId).toBe(user.id)
	})

	dbTest('Created note has correct data', async ({ db }) => {
		const user = createUser()
		await db.insert(usersTable).values(user)

		const note = createNote(user.id, {
			title: 'A new note',
			body: 'Some note content',
		})

		const result = await createNoteQuery(db, user.id, note)

		expect(result?.id).toBe(note.id)
		expect(result?.title).toBe(note.title)
		expect(result?.body).toBe(note.body)
		expect(result?.markdown).toBe(note.markdown)
	})
})

describe('updateNoteQuery', () => {
	dbTest('Updated note has correct data', async ({ db }) => {
		const user = createUser()
		await db.insert(usersTable).values(user)

		const note = createNote(user.id, { title: 'Original title' })
		await db.insert(notesTable).values(note)

		const updatedNote = createNote(user.id, {
			title: 'Updated title',
			body: 'Updated body',
		})

		const result = await updateNoteQuery(db, user.id, {
			...updatedNote,
			id: note.id,
		})

		expect(result?.id).toBe(note.id)
		expect(result?.title).toBe(updatedNote.title)
		expect(result?.body).toBe(updatedNote.body)
		expect(result?.markdown).toBe(updatedNote.markdown)
	})

	dbTest('Allows for partial updates', async ({ db }) => {
		const user = createUser()
		await db.insert(usersTable).values(user)

		const note = createNote(user.id, {
			title: 'Original title',
			body: 'Original body',
		})
		await db.insert(notesTable).values(note)

		const result = await updateNoteQuery(db, user.id, {
			id: note.id,
			title: 'Updated title',
		})

		expect(result?.title).toBe('Updated title')
		expect(result?.body).toBe(note.body)
		expect(result?.markdown).toBe(note.markdown)
	})

	dbTest('Can only update note belonging to user', async ({ db }) => {
		const userA = createUser()
		const userB = createUser()
		await db.insert(usersTable).values([userA, userB])

		const note = createNote(userB.id, { title: 'Original title' })
		await db.insert(notesTable).values(note)

		const result = await updateNoteQuery(db, userA.id, {
			id: note.id,
			title: 'Updated title',
		})

		expect(result).toBeUndefined()
	})
})

describe('deleteNoteQuery', () => {
	dbTest('Can only delete note belonging to user', async ({ db }) => {
		const userA = createUser()
		const userB = createUser()
		await db.insert(usersTable).values([userA, userB])

		const note = createNote(userB.id, { title: 'A note' })
		await db.insert(notesTable).values(note)

		const result = await deleteNoteQuery(db, userA.id, note.id)

		expect(result).toBeUndefined()
	})

	dbTest('Deleted note no longer exists', async ({ db }) => {
		const user = createUser()
		await db.insert(usersTable).values(user)

		const note = createNote(user.id, { title: 'A note' })
		await db.insert(notesTable).values(note)

		await deleteNoteQuery(db, user.id, note.id)

		const remaining = await db
			.select()
			.from(notesTable)
			.where(eq(notesTable.id, note.id))

		expect(remaining).toHaveLength(0)
	})
})

describe('reassignNotesQuery', () => {
	dbTest(
		'Moves only the source user’s notes to the target user',
		async ({ db }) => {
			const anonymousUser = createUser({ isAnonymous: true })
			const otherUser = createUser()
			const targetUser = createUser()
			await db.insert(usersTable).values([anonymousUser, otherUser, targetUser])

			const anonymousNote = createNote(anonymousUser.id, {
				title: 'Written while anonymous',
			})
			const otherNote = createNote(otherUser.id, {
				title: 'Someone else’s note',
			})
			await db.insert(notesTable).values([anonymousNote, otherNote])

			await reassignNotesQuery(db, anonymousUser.id, targetUser.id)

			const targetNotes = await getNotesQuery(db, targetUser.id)
			expect(targetNotes).toHaveLength(1)
			expect(targetNotes[0]?.id).toBe(anonymousNote.id)

			const untouchedNotes = await getNotesQuery(db, otherUser.id)
			expect(untouchedNotes).toHaveLength(1)
			expect(untouchedNotes[0]?.id).toBe(otherNote.id)
		},
	)

	dbTest(
		'Merges alongside notes the target user already owns',
		async ({ db }) => {
			const anonymousUser = createUser({ isAnonymous: true })
			const targetUser = createUser()
			await db.insert(usersTable).values([anonymousUser, targetUser])

			const anonymousNote = createNote(anonymousUser.id, {
				title: 'Written while anonymous',
			})
			const existingNote = createNote(targetUser.id, {
				title: 'Already on the account',
			})
			await db.insert(notesTable).values([anonymousNote, existingNote])

			await reassignNotesQuery(db, anonymousUser.id, targetUser.id)

			const targetNotes = await getNotesQuery(db, targetUser.id)
			expect(targetNotes).toHaveLength(2)
			expect(targetNotes.map((note) => note.id).sort()).toEqual(
				[anonymousNote.id, existingNote.id].sort(),
			)
		},
	)
})

describe('deleteNotesForUserQuery', () => {
	dbTest('Removes only that user’s notes', async ({ db }) => {
		const userA = createUser()
		const userB = createUser()
		await db.insert(usersTable).values([userA, userB])

		const noteA = createNote(userA.id, { title: 'User A note' })
		const noteB = createNote(userB.id, { title: 'User B note' })
		await db.insert(notesTable).values([noteA, noteB])

		await deleteNotesForUserQuery(db, userA.id)

		expect(await getNotesQuery(db, userA.id)).toHaveLength(0)
		expect(await getNotesQuery(db, userB.id)).toHaveLength(1)
	})
})

describe('deleting a user', () => {
	dbTest('Cascades to delete their notes', async ({ db }) => {
		const user = createUser({ isAnonymous: true })
		await db.insert(usersTable).values(user)

		const note = createNote(user.id, { title: 'Anonymous note' })
		await db.insert(notesTable).values(note)

		await db.delete(usersTable).where(eq(usersTable.id, user.id))

		const remaining = await db
			.select()
			.from(notesTable)
			.where(eq(notesTable.id, note.id))

		expect(remaining).toHaveLength(0)
	})
})

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

	dbTest('Performs full-text search on note bodies', async ({ db }) => {
		const user = createUser()
		await db.insert(usersTable).values(user)

		const noteA = createNote(user.id, {
			title: 'Unrelated title',
			body: 'A treatise on the history of hot air balloons',
		})
		const noteB = createNote(user.id, {
			title: 'Another unrelated title',
			body: 'Notes from a cooking class',
		})

		await db.insert(notesTable).values([noteA, noteB])

		const results = await searchQuery(db, user.id, 'balloons')

		expect(results).toHaveLength(1)
		expect(results[0]?.id).toBe(noteA.id)
	})

	dbTest('Only returns body matches belonging to user', async ({ db }) => {
		const userA = createUser()
		const userB = createUser()
		await db.insert(usersTable).values([userA, userB])

		const noteA = createNote(userA.id, { body: 'Talks about spaceships' })
		const noteB = createNote(userB.id, { body: 'Talks about spaceships' })

		await db.insert(notesTable).values([noteA, noteB])

		const results = await searchQuery(db, userA.id, 'spaceships')

		expect(results).toHaveLength(1)
		expect(results[0]?.id).toBe(noteA.id)
	})

	dbTest(
		'Ranks a note matching both title and body above a single match',
		async ({ db }) => {
			const user = createUser()
			await db.insert(usersTable).values(user)

			const noteA = createNote(user.id, {
				title: 'Notes on dragons',
				body: 'Everything I know about dragons and their habits',
			})
			const noteB = createNote(user.id, {
				title: 'A completely different title',
				body: 'A single mention of dragons here',
			})

			await db.insert(notesTable).values([noteA, noteB])

			const results = await searchQuery(db, user.id, 'dragons')

			expect(results[0]?.id).toBe(noteA.id)
			expect(results[1]?.id).toBe(noteB.id)
		},
	)
})
