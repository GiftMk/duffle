import { ArrowFatRightIcon } from '@phosphor-icons/react/dist/ssr'
import { useHotkey } from '@tanstack/react-hotkeys'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { type Ref, useRef } from 'react'
import { TypeAnimation } from 'react-type-animation'
import { createDefaultBoard } from '@/lib/actions'
import { boardsStore } from '@/state/boards-store'

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
		sequence={[1000, 'Literally just a Kanban board ദ്ദി˙ ᴗ ˙ )']}
		speed={65}
	/>
)

const EnterButton = ({ ref }: { ref?: Ref<HTMLButtonElement> }) => {
	const navigate = useNavigate()

	const handleClick = () => {
		const boards = Object.values(boardsStore.get().context.boards)

		const board =
			boards.length === 0
				? createDefaultBoard()
				: boards.reduce((mostRecent, board) =>
						board.updatedAt > mostRecent.updatedAt ? board : mostRecent,
					)

		navigate({ to: '/boards/$boardId', params: { boardId: board.id } })
	}

	return (
		<motion.div
			className='flex items-center gap-2'
			initial={{ opacity: 0, scale: 0.8, y: -300 }}
			animate={{ opacity: 1, scale: 1, y: 0 }}
			transition={{ type: 'spring', duration: 0.6, bounce: 0.6, delay: 0.3 }}
		>
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
		</motion.div>
	)
}

function RouteComponent() {
	const enterButtonRef = useRef<HTMLButtonElement>(null)

	useHotkey('Enter', () => {
		if (enterButtonRef.current) {
			enterButtonRef.current.click()
		}
	})

	return (
		<main className='flex h-full w-full flex-col items-center justify-center gap-12 text-center text-typography-950'>
			<Heading />
			<SubHeading />
			<EnterButton ref={enterButtonRef} />
		</main>
	)
}
