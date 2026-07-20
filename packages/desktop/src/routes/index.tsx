import { createFileRoute } from '@tanstack/react-router'
import { FileGrid } from '#/components/file-grid'
import { getAllFiles } from '#/lib/server'
import { useEffect } from 'react'
import { fileStore } from '#/state/file-store'

export const Route = createFileRoute('/')({
	component: Index,
	loader: () => getAllFiles(),
})

function Index() {
	const files = Route.useLoaderData()
	useEffect(() => fileStore.trigger.setPersisted({ files }), [files])

	return (
		<main className='flex flex-col bg-surface-100 p-10'>
			<FileGrid />
		</main>
	)
}
