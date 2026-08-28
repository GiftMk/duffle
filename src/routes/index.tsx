import { ArrowFatRightIcon } from '@phosphor-icons/react/dist/ssr'
import { useHotkey } from '@tanstack/react-hotkeys'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { useRef } from 'react'
import { TypeAnimation } from 'react-type-animation'
import { uuidv7 } from 'uuidv7'
import { FadeIn, SpringPopIn } from '@/components/animations'
import { GETTING_STARTED_MARKDOWN } from '@/lib/constants'
import { noteQueryOptions } from '@/lib/queries/note'
import { Route as NotesIndexRoute } from '@/routes/_app/notes.index'
import { createNoteFn, getLatestNoteFn } from '@/server/notes.functions'

export const Route = createFileRoute('/')({
	component: RouteComponent,
	loader: async () => getLatestNoteFn(),
})

const Heading = () => (
	<FadeIn>
		<h1 className='font-bold text-9xl tracking-tight'>Duffle.</h1>
	</FadeIn>
)

const SubHeading = () => (
	<TypeAnimation
		className='text-pretty text-2xl'
		sequence={[1000, 'A happy place for all your writing (˶ᵔ ᵕ ᵔ˶)']}
		speed={65}
	/>
)

function RouteComponent() {
	const latestNote = Route.useLoaderData()
	const navigate = useNavigate()
	const router = useRouter()
	const queryClient = useQueryClient()
	const actionButtonRef = useRef<HTMLButtonElement>(null)

	const handleClick = async () => {
		let id: string | undefined

		if (latestNote) {
			id = latestNote.id
		} else {
			const note = await createNoteFn({
				data: { id: uuidv7(), markdown: GETTING_STARTED_MARKDOWN },
			})
			if (note) {
				queryClient.setQueryData(noteQueryOptions(note.id).queryKey, note)
				router.invalidate({
					filter: (match) =>
						match.routeId === NotesIndexRoute.id || match.routeId === Route.id,
				})
			}
			id = note?.id
		}

		if (id) {
			navigate({ to: '/notes/$noteId', params: { noteId: id } })
		}
	}

	useHotkey('Enter', () => {
		actionButtonRef.current?.click()
	})

	return (
		<main className='flex h-full w-full flex-col items-center justify-center gap-12 text-center'>
			<Heading />
			<SubHeading />
			<SpringPopIn className='flex items-center gap-2' initial={{ y: -300 }}>
				<button
					ref={actionButtonRef}
					type='button'
					onClick={handleClick}
					className='rounded-sm border border-primary-500 px-5 py-2 transition-all duration-200 hover:scale-110 hover:bg-primary-500/10'
				>
					<ArrowFatRightIcon
						size={22}
						className='fill-primary-500'
						weight='duotone'
					/>
				</button>
			</SpringPopIn>
		</main>
	)
}
