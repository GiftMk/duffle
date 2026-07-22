import { ShuffleIcon } from '@phosphor-icons/react'
import { ArrowFatRightIcon } from '@phosphor-icons/react/dist/ssr'
import { useHotkey } from '@tanstack/react-hotkeys'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { type PropsWithChildren, type Ref, useRef, useState } from 'react'
import { TypeAnimation } from 'react-type-animation'
import { SplashScreen } from '@/components/splash-screen'
import { useAvatarStyle } from '@/hooks/use-avatar-style'
import { createNote } from '@/lib/actions'
import { cn } from '@/lib/utils'

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
		sequence={[1000, 'A happy place for all your writing.']}
		speed={65}
	/>
)

const ShuffleButton = () => {
	const [_clickCount, setClickCount] = useState(0)
	const { setStyle, styles, style } = useAvatarStyle()

	const nextStyle = () => {
		const index = styles.indexOf(style)
		const next = styles[(index + 1) % styles.length]
		setStyle(next ?? style)
	}

	const handleClick = () => {
		setClickCount((curr) => curr + 1)
		nextStyle()
	}

	return (
		<div className='flex flex-col items-center gap-2 text-surface-500'>
			<button
				onClick={handleClick}
				className='w-fit rounded-sm border border-surface-500 px-5 py-2 transition-all duration-200 hover:scale-110 hover:bg-surface-500/10'
				type='button'
			>
				<ShuffleIcon size={22} className='fill-surface-500' />
			</button>
			<p className={cn('font-drawn')}>Don't click this</p>
		</div>
	)
}

const EnterButton = ({ ref }: { ref?: Ref<HTMLButtonElement> }) => {
	const navigate = useNavigate()

	const handleClick = async () => {
		const id = await createNote()
		navigate({ to: '/notes/$noteId', params: { noteId: id } })
	}

	return (
		<div className='flex flex-col items-center gap-2 text-primary-500'>
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
			<p className='font-drawn'>Click here to get started...</p>
		</div>
	)
}

const ActionButtons = ({ children }: PropsWithChildren) => {
	return (
		<motion.div
			className='relative flex items-center gap-12'
			initial={{ opacity: 0, scale: 0.8, y: -300 }}
			animate={{ opacity: 1, scale: 1, y: 0 }}
			transition={{ type: 'spring', duration: 0.6, bounce: 0.6, delay: 0.3 }}
		>
			{children}
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
		<main className='relative flex h-full w-full flex-col items-center justify-center gap-12 text-center text-typography-950'>
			<SplashScreen />
			<Heading />
			<SubHeading />
			<ActionButtons>
				<ShuffleButton />
				<EnterButton ref={enterButtonRef} />
			</ActionButtons>
		</main>
	)
}
