import { eq, useLiveQuery } from '@tanstack/react-db'
import { createFileRoute } from '@tanstack/react-router'
import { MarkdownEditor } from '../components/editor'
import { ErrorPage } from '../components/error-page'
import { LoadingPage } from '../components/loading-page'
import { documentCollection } from '../lib/collections'

export const Route = createFileRoute('/docs/$documentId')({
	component: RouteComponent,
})

function RouteComponent() {
	const { documentId } = Route.useParams()
	const {
		data: document,
		isLoading,
		isError,
	} = useLiveQuery((q) =>
		q
			.from({ document: documentCollection })
			.where(({ document }) => eq(document.id, documentId))
			.findOne(),
	)

	if (isLoading) {
		return <LoadingPage />
	}

	if (isError) {
		return <ErrorPage />
	}

	if (document)
		return (
			<main className='flex h-full w-full items-center justify-center'>
				<MarkdownEditor document={document} />
			</main>
		)
}
