import { ArrowFatRightIcon } from '@phosphor-icons/react/dist/ssr'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import { uuidv7 } from 'uuidv7'
import { documentCollection } from '../common/lib/collections'

export const Route = createFileRoute('/')({
	component: RouteComponent,
})

const Heading = () => (
	<motion.div
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		transition={{ duration: 0.5 }}
	>
		<h1 className='font-semibold text-9xl tracking-tight'>Duffle.</h1>
	</motion.div>
)

const SubHeading = () => (
	<TypeAnimation
		className='text-pretty text-2xl'
		sequence={[
			1000,
			'A happy place for your writing.',
			2000,
			'A happy place for your essays.',
			2000,
			'A happy place for your lecture recordings.',
			2000,
			'A happy place for your meeting minutes.',
			2000,
			'A happy place for your late night journaling.',
			2000,
			'A happy place for literally anything that contains text ╰(*´︶`*)╯',
		]}
		speed={55}
	/>
)

const ActionButton = () => {
	const navigate = useNavigate()

	const handleClick = async () => {
		const id = uuidv7()

		documentCollection.insert({
			id,
			markdown: '# ',
			createdAt: new Date().toISOString(),
		})

		navigate({ to: '/docs/$documentId', params: { documentId: id } })
	}

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.8, y: -300 }}
			animate={{ opacity: 1, scale: 1, y: 0 }}
			transition={{ type: 'spring', duration: 0.6, bounce: 0.6, delay: 0.3 }}
		>
			<button
				type='button'
				onClick={handleClick}
				className='rounded-sm border border-primary px-5 py-2 text-primary transition-all duration-200 hover:scale-110 hover:bg-primary/10'
			>
				<ArrowFatRightIcon
					size={22}
					className='fill-primary'
					weight='duotone'
				/>
			</button>
		</motion.div>
	)
}

function RouteComponent() {
	return (
		<main className='flex h-5/6 w-full flex-col items-center justify-center gap-12 text-center text-typography'>
			<Heading />
			<SubHeading />
			<ActionButton />
		</main>
	)
}
