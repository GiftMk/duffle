import { eq, useLiveQuery } from '@tanstack/react-db'
import { createFileRoute } from '@tanstack/react-router'
import { EditorSpine } from '@/components/editor-spine'
import { MarkdownEditor } from '../components/editor'
import { ErrorPage } from '../components/error-page'
import { LoadingPage } from '../components/loading-page'
import { noteCollection } from '../lib/collections'

export const Route = createFileRoute('/notes/$noteId')({
	component: RouteComponent,
})

function RouteComponent() {
	const { noteId } = Route.useParams()
	const {
		data: note,
		isLoading,
		isError,
	} = useLiveQuery((q) =>
		q
			.from({ note: noteCollection })
			.where(({ note }) => eq(note.id, noteId))
			.findOne(),
	)

	if (isLoading) {
		return <LoadingPage />
	}

	if (isError) {
		return <ErrorPage />
	}

	if (note)
		return (
			<main className='flex h-full w-full items-center justify-center'>
				<EditorSpine />
				<MarkdownEditor document={note} />
			</main>
		)
}
