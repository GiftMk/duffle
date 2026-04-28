import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { createDocument } from '../lib/api'

export const Route = createFileRoute('/')({
	component: RouteComponent,
})

function RouteComponent() {
	const navigate = useNavigate()

	const handleClick = async () => {
		const { data: doc } = await createDocument('# ')

		if (!doc) {
			alert('something went wrong when creating your document')
			return
		}

		navigate({ to: '/edit/$documentId', params: { documentId: doc.id } })
	}

	return (
		<button
			className='rounded-lg bg-blue-500 px-2 py-4 text-white'
			type='button'
			onClick={handleClick}
		>
			Create empty document
		</button>
	)
}
