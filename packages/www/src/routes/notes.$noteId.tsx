import { createFileRoute } from '@tanstack/react-router'
import { EditorSpine } from '@/components/editor-spine'
import { db } from '@/lib/db'
import { MarkdownEditor } from '../components/editor'

export const Route = createFileRoute('/notes/$noteId')({
	component: RouteComponent,
	loader: async ({ params }) => {
		return await db.notes.get(params.noteId)
	},
})

function RouteComponent() {
	const note = Route.useLoaderData()

	if (note)
		return (
			<main className='flex h-full w-full items-center justify-center'>
				<EditorSpine />
				<MarkdownEditor note={note} />
			</main>
		)
}
