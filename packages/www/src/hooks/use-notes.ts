import { useEffect, useState } from 'react'
import { db, type Note } from '@/lib/db'

export type UseNotes = {
	skip?: boolean
	limit: number
	orderBy?: keyof Note
}

export const useNotes = ({
	skip = false,
	limit,
	orderBy = 'createdAt',
}: UseNotes) => {
	const [notes, setNotes] = useState<Note[]>([])

	useEffect(() => {
		if (skip) {
			return
		}

		let query = db.notes.orderBy(orderBy)

		if (limit) {
			query = query.limit(limit)
		}

		query.toArray().then(setNotes)
	}, [skip, limit, orderBy])

	return notes
}
