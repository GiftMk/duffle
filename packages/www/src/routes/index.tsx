import { ArrowFatRightIcon } from '@phosphor-icons/react/dist/ssr'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { type Ref, useRef } from 'react'
import { TypeAnimation } from 'react-type-animation'
import { FadeIn, SpringPopIn } from '@/components/animations'
import { createBoard } from '@/lib/actions'
import { boardsCollection } from '@/lib/collections'

export const Route = createFileRoute('/')({
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

const getLastUpdatedBoard = () => {
	return boardsCollection.toArray
		.toSorted(
			(a, b) =>
				new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
		)
		.at(0)
}

const EnterButton = ({ ref }: { ref?: Ref<HTMLButtonElement> }) => {
	const navigate = useNavigate()

	const handleClick = () => {
		const lastUpdated = getLastUpdatedBoard()
		const board = lastUpdated ? lastUpdated : createBoard('Getting Started')

		navigate({ to: '/boards/$boardId', params: { boardId: board.id } })
	}

	return (
		<SpringPopIn className='flex items-center gap-2' initial={{ y: -300 }}>
			<button
				ref={ref}
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
	)
}

function RouteComponent() {
	const enterButtonRef = useRef<HTMLButtonElement>(null)

	return (
		<main className='flex h-full w-full flex-col items-center justify-center gap-12 text-center'>
			<Heading />
			<SubHeading />
			<EnterButton ref={enterButtonRef} />
		</main>
	)
}
