import { uuidv7 } from 'uuidv7'
import { noteCollection } from './collections'

export const createNote = () => {
	const id = uuidv7()
	noteCollection.insert({
		id,
		markdown: '# ',
		createdAt: new Date().toISOString(),
	})

	return id
}
