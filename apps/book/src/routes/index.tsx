import { FadeIn, SpringPopIn } from '@duffle/ui'
import { ArrowFatRightIcon } from '@phosphor-icons/react/dist/ssr'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { TypeAnimation } from 'react-type-animation'
import { useCreateNote } from '@/hooks/notes'

export const Route = createFileRoute('/')({
	ssr: true,
	component: RouteComponent,
})

const Heading = () => (
	<FadeIn>
		<h1 className='font-bold text-9xl tracking-tight'>
			Duffle<span className='text-primary-500'>Book.</span>
		</h1>
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
	const navigate = useNavigate()
	const createNote = useCreateNote()

	const handleClick = () => {
		const note = createNote()
		navigate({ to: '/notes/$noteId', params: { noteId: note.id } })
	}

	return (
		<main className='flex h-full w-full flex-col items-center justify-center gap-12 text-center'>
			<Heading />
			<SubHeading />
			<SpringPopIn className='flex items-center gap-2' initial={{ y: -300 }}>
				<button
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
