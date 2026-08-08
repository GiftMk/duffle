import { eq, useLiveQuery } from '@tanstack/react-db'
import { notesCollection } from '@/lib/collections'

export const useNote = (id: string) => {
	const { data } = useLiveQuery(
		(q) =>
			q
				.from({ note: notesCollection })
				.where(({ note }) => eq(note.id, id))
				.findOne(),
		[id],
	)
	return data
}
