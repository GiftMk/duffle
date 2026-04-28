import { createFileRoute, notFound } from '@tanstack/react-router'
import { getDocument } from '../lib/api'
import { MarkdownEditor } from '../markdown-editor'

export const Route = createFileRoute('/edit/$documentId')({
	component: RouteComponent,
	loader: async ({ params }) => {
		const { data } = await getDocument(params.documentId)

		if (!data) {
			throw notFound()
		}

		return data
	},
})

function RouteComponent() {
	const document = Route.useLoaderData()

	return (
		<main className='flex h-full w-full items-center justify-center'>
			<MarkdownEditor document={document} />
		</main>
	)
}
