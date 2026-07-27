import { upload } from '@vercel/blob/client'
import {
	adjectives,
	animals,
	uniqueNamesGenerator,
} from 'unique-names-generator'
import { db } from './db'

const generateRandomName = () => {
	return uniqueNamesGenerator({
		dictionaries: [adjectives, animals],
		separator: '-',
		length: 2,
	})
}

export const exportNotes = async () => {
	const name = generateRandomName()
	const notes = await db.notes.toArray()
	const json = JSON.stringify({
		notes,
	})

	await upload(name, json, {
		access: 'public',
		handleUploadUrl: '/api/export',
	})
}
