import { KanbanIcon, PencilSimpleLineIcon } from '@phosphor-icons/react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { TypeAnimation } from 'react-type-animation'
import { FadeIn, SpringPopIn } from '@/components/animations'
import { LandingNavButton } from '@/components/landing-nav-button'
import { useCreateNote } from '@/hooks/notes'

export const Route = createFileRoute('/')({
	ssr: true,
	component: RouteComponent,
})

const Heading = () => (
	<FadeIn>
		<h1 className='font-bold text-9xl tracking-tight'>Duffle.</h1>
	</FadeIn>
)

const SubHeading = () => (
	<TypeAnimation
		className='text-pretty text-2xl'
		sequence={[1000, 'A place to write and move sticky notes (˶ᵔ ᵕ ᵔ˶)']}
		speed={65}
	/>
)

function RouteComponent() {
	const navigate = useNavigate()
	const createNote = useCreateNote()

	const handleCreateNote = () => {
		const note = createNote()
		navigate({ to: '/notes/$noteId', params: { noteId: note.id } })
	}

	return (
		<main className='flex h-full w-full flex-col items-center justify-center gap-12 text-center'>
			<Heading />
			<SubHeading />
			<SpringPopIn className='flex items-center gap-16' initial={{ y: -300 }}>
				<LandingNavButton icon={KanbanIcon} label='Kanban' to='/boards' />
				<LandingNavButton
					icon={PencilSimpleLineIcon}
					label='Notes'
					onClick={handleCreateNote}
				/>
			</SpringPopIn>
		</main>
	)
}
