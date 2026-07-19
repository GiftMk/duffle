import { createFileRoute } from '@tanstack/react-router'
import { FileGrid } from '#/components/file-grid'
import { getAllFiles } from '#/lib/server'

export const Route = createFileRoute('/')({
	component: Index,
	loader: async () => {
		return getAllFiles()
	},
})

function Index() {
	const files = Route.useLoaderData()

	return (
		<main className='flex flex-col bg-surface-100 p-10'>
			<FileGrid files={files} />
		</main>
	)
}
