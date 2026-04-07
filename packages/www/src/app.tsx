import { MarkdownEditor } from './markdown-editor'
import type { Note } from './types/note'

const note: Note = {
	id: crypto.randomUUID(),
	title: 'First MD note',
	content: '#',
	createdAt: new Date().toISOString(),
}

export default function App() {
	return (
		<main className='flex h-full w-full items-center justify-center'>
			<MarkdownEditor note={note} />
		</main>
	)
}
