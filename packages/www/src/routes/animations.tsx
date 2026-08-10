import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Kanmoji } from '@/components/kanmoji'

export const Route = createFileRoute('/animations')({
	ssr: false,
	component: AnimationsShowcase,
})

const CANMOJI = [
	'(„• ֊ •„)੭',
	'(˶ᵔ ᵕ ᵔ˶)',
	'(´｡• ᵕ •｡` )',
	'(´ ∀ ` )',
	'(´・ω・`)',
]

const animations = [
	{
		id: 'bounce',
		name: 'Bouncing Ball',
		component: () => (
			<motion.div
				animate={{ y: [0, -120, 0] }}
				transition={{
					duration: 0.8,
					times: [0, 0.5, 1],
					repeat: Infinity,
					ease: 'easeInOut',
				}}
				className='text-6xl'
			>
				<Kanmoji>{CANMOJI[0]}</Kanmoji>
			</motion.div>
		),
	},
	{
		id: 'roll',
		name: 'Rolling Character',
		component: () => (
			<motion.div
				animate={{
					x: [-200, 200],
					rotate: [0, 360],
				}}
				transition={{
					duration: 3,
					repeat: Infinity,
					ease: 'linear',
				}}
				className='text-6xl'
			>
				<Kanmoji>{CANMOJI[1]}</Kanmoji>
			</motion.div>
		),
	},
	{
		id: 'float',
		name: 'Floating Drift',
		component: () => (
			<motion.div
				animate={{
					y: [-30, 30],
					x: [-20, 20],
				}}
				transition={{
					duration: 4,
					times: [0, 0.5, 1],
					repeat: Infinity,
					ease: 'easeInOut',
				}}
				className='text-6xl'
			>
				<Kanmoji>{CANMOJI[2]}</Kanmoji>
			</motion.div>
		),
	},
	{
		id: 'swing',
		name: 'Swinging Pendulum',
		component: () => (
			<div className='perspective'>
				<motion.div
					animate={{ rotate: [-25, 25] }}
					transition={{
						duration: 1.5,
						repeat: Infinity,
						ease: 'easeInOut',
					}}
					className='origin-top text-6xl'
					style={{ transformOrigin: 'top center' }}
				>
					<Kanmoji>{CANMOJI[3]}</Kanmoji>
				</motion.div>
			</div>
		),
	},
	{
		id: 'pulse-bounce',
		name: 'Pulse & Bounce',
		component: () => (
			<motion.div
				animate={{
					y: [0, -80, 0],
					scale: [1, 1.15, 1],
				}}
				transition={{
					duration: 0.7,
					times: [0, 0.5, 1],
					repeat: Infinity,
					ease: 'easeOut',
				}}
				className='text-6xl'
			>
				<Kanmoji>{CANMOJI[4]}</Kanmoji>
			</motion.div>
		),
	},
	{
		id: 'multi',
		name: 'Dance Party',
		component: () => (
			<div className='flex items-end justify-center gap-8'>
				{CANMOJI.map((emoji, i) => (
					<motion.div
						key={emoji}
						animate={{
							y: [0, -60, 0],
							rotate: [0, 10, -10, 0],
						}}
						transition={{
							duration: 1 + i * 0.1,
							repeat: Infinity,
							ease: 'easeInOut',
							delay: i * 0.15,
						}}
						className='text-5xl'
					>
						<Kanmoji>{emoji}</Kanmoji>
					</motion.div>
				))}
			</div>
		),
	},
	{
		id: 'spin',
		name: 'Spinning Joy',
		component: () => (
			<motion.div
				animate={{ rotate: 360 }}
				transition={{
					duration: 2,
					repeat: Infinity,
					ease: 'linear',
				}}
				className='text-6xl'
			>
				<Kanmoji>{CANMOJI[0]}</Kanmoji>
			</motion.div>
		),
	},
	{
		id: 'wiggle',
		name: 'Happy Wiggle',
		component: () => (
			<motion.div
				animate={{
					x: [-10, 10, -10],
					rotate: [-5, 5, -5],
				}}
				transition={{
					duration: 0.4,
					repeat: Infinity,
					ease: 'easeInOut',
				}}
				className='text-6xl'
			>
				<Kanmoji>{CANMOJI[2]}</Kanmoji>
			</motion.div>
		),
	},
]

function AnimationsShowcase() {
	const [selectedId, setSelectedId] = useState('bounce')
	const selected = animations.find((a) => a.id === selectedId)

	return (
		<main className='h-full w-full bg-gradient-to-br from-slate-50 to-slate-100 p-8 dark:from-slate-900 dark:to-slate-800'>
			<div className='mx-auto max-w-4xl'>
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className='mb-12'
				>
					<h1 className='mb-2 font-bold text-5xl'>Animation Playground</h1>
					<p className='text-lg text-slate-600 dark:text-slate-300'>
						Playful canmoji animations for loading states
					</p>
				</motion.div>

				<div className='grid grid-cols-1 gap-8 lg:grid-cols-4'>
					{/* Animation List */}
					<div className='lg:col-span-1'>
						<div className='sticky top-8 flex flex-col gap-2'>
							{animations.map((anim) => (
								<motion.button
									key={anim.id}
									onClick={() => setSelectedId(anim.id)}
									whileHover={{ x: 4 }}
									whileTap={{ scale: 0.98 }}
									className={`rounded-lg px-4 py-3 text-left font-medium transition-all ${
										selectedId === anim.id
											? 'bg-blue-500 text-white shadow-lg'
											: 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600'
									}`}
								>
									{anim.name}
								</motion.button>
							))}
						</div>
					</div>

					{/* Animation Preview */}
					<div className='lg:col-span-3'>
						<motion.div
							key={selectedId}
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							className='flex min-h-[400px] items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 shadow-xl dark:border-slate-600 dark:bg-slate-700'
						>
							{selected && <selected.component />}
						</motion.div>

						{/* Description */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.2 }}
							className='mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20'
						>
							<h3 className='mb-1 font-semibold text-blue-900 dark:text-blue-100'>
								{selected?.name}
							</h3>
							<p className='text-blue-800 text-sm dark:text-blue-200'>
								Try using this animation in your loading pages! Built with
								Framer Motion for smooth, performant animations.
							</p>
						</motion.div>
					</div>
				</div>

				{/* Usage Tips */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className='mt-12 rounded-lg bg-slate-100 p-6 dark:bg-slate-800'
				>
					<h2 className='mb-3 font-bold text-xl'>💡 Usage Tips</h2>
					<ul className='space-y-2 text-slate-700 text-sm dark:text-slate-300'>
						<li>
							• Copy any animation code into your loading components for instant
							upgrades
						</li>
						<li>
							• Mix and match animations with different canmoji from the{' '}
							<code className='rounded bg-slate-200 px-2 py-1 dark:bg-slate-700'>
								CANMOJI
							</code>{' '}
							array
						</li>
						<li>
							• Adjust{' '}
							<code className='rounded bg-slate-200 px-2 py-1 dark:bg-slate-700'>
								duration
							</code>{' '}
							and{' '}
							<code className='rounded bg-slate-200 px-2 py-1 dark:bg-slate-700'>
								transition
							</code>{' '}
							properties for faster/slower animations
						</li>
						<li>
							• All animations use Framer Motion—no extra dependencies needed!
						</li>
					</ul>
				</motion.div>
			</div>
		</main>
	)
}
