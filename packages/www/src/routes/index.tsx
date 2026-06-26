import { ArrowFatRightIcon } from '@phosphor-icons/react/dist/ssr'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import { createNote } from '@/lib/actions'
import { useHotkey } from '@tanstack/react-hotkeys'
import { useRef, type ComponentProps, type Ref } from 'react'

export const Route = createFileRoute('/')({
	component: RouteComponent,
})

const Heading = () => (
	<motion.div
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		transition={{ duration: 0.5 }}
	>
		<h1 className='font-bold text-9xl tracking-tight'>Duffle.</h1>
	</motion.div>
)

const SubHeading = () => (
	<TypeAnimation
		className='text-pretty text-2xl'
		sequence={[1000, 'A happy place for all your writing (˶˃ ᵕ ˂˶)']}
		speed={65}
	/>
)

const ActionButton = ({ ref }: { ref?: Ref<HTMLButtonElement> }) => {
	const navigate = useNavigate()

	const handleClick = async () => {
		const id = await createNote()
		navigate({ to: '/notes/$noteId', params: { noteId: id } })
	}

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.8, y: -300 }}
			animate={{ opacity: 1, scale: 1, y: 0 }}
			transition={{ type: 'spring', duration: 0.6, bounce: 0.6, delay: 0.3 }}
		>
			<button
				ref={ref}
				type='button'
				onClick={handleClick}
				className='rounded-sm border border-primary-500 px-5 py-2 text-primary-500 transition-all duration-200 hover:scale-110 hover:bg-primary-500/10'
			>
				<ArrowFatRightIcon
					size={22}
					className='fill-primary-500'
					weight='duotone'
				/>
			</button>
		</motion.div>
	)
}

function RouteComponent() {
	const actionButtonRef = useRef<HTMLButtonElement>(null)

	useHotkey('Enter', () => {
		if (actionButtonRef.current) {
			actionButtonRef.current.click()
		}
	})

	return (
		<main className='flex h-5/6 w-full flex-col items-center justify-center gap-12 text-center text-typography-950'>
			<Heading />
			<SubHeading />
			<ActionButton ref={actionButtonRef} />
		</main>
	)
}
