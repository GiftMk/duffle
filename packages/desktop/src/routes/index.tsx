import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { FileGrid } from '#/components/file-grid'
import { getAllFiles } from '#/lib/server'
import { fileStore } from '#/state/file-store'

export const Route = createFileRoute('/')({
	component: Index,
	loader: () => getAllFiles(),
})

function Index() {
	const files = Route.useLoaderData()
	useEffect(() => fileStore.trigger.setPersisted({ files }), [files])

	return (
		<main className='flex flex-col gap-4 bg-surface-100 px-10 py-4'>
			<h1 className='text-center font-bold text-base text-typography-500'>
				Duffle Desktop.
			</h1>
			<FileGrid />
		</main>
	)
}
