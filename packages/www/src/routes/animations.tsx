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
					className='text-6xl origin-top'
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
			<div className='flex gap-8 items-end justify-center'>
				{CANMOJI.map((emoji, i) => (
					<motion.div
						key={i}
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
		<main className='h-full w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8'>
			<div className='max-w-4xl mx-auto'>
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className='mb-12'
				>
					<h1 className='text-5xl font-bold mb-2'>Animation Playground</h1>
					<p className='text-lg text-slate-600 dark:text-slate-300'>
						Playful canmoji animations for loading states
					</p>
				</motion.div>

				<div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
					{/* Animation List */}
					<div className='lg:col-span-1'>
						<div className='flex flex-col gap-2 sticky top-8'>
							{animations.map((anim) => (
								<motion.button
									key={anim.id}
									onClick={() => setSelectedId(anim.id)}
									whileHover={{ x: 4 }}
									whileTap={{ scale: 0.98 }}
									className={`px-4 py-3 rounded-lg text-left font-medium transition-all ${
										selectedId === anim.id
											? 'bg-blue-500 text-white shadow-lg'
											: 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600'
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
							className='bg-white dark:bg-slate-700 rounded-2xl shadow-xl p-12 min-h-[400px] flex items-center justify-center border border-slate-200 dark:border-slate-600'
						>
							{selected && <selected.component />}
						</motion.div>

						{/* Description */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.2 }}
							className='mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800'
						>
							<h3 className='font-semibold text-blue-900 dark:text-blue-100 mb-1'>
								{selected?.name}
							</h3>
							<p className='text-sm text-blue-800 dark:text-blue-200'>
								Try using this animation in your loading pages! Built with Framer Motion
								for smooth, performant animations.
							</p>
						</motion.div>
					</div>
				</div>

				{/* Usage Tips */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className='mt-12 p-6 bg-slate-100 dark:bg-slate-800 rounded-lg'
				>
					<h2 className='text-xl font-bold mb-3'>💡 Usage Tips</h2>
					<ul className='space-y-2 text-sm text-slate-700 dark:text-slate-300'>
						<li>
							• Copy any animation code into your loading components for instant upgrades
						</li>
						<li>
							• Mix and match animations with different canmoji from the{' '}
							<code className='bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded'>
								CANMOJI
							</code>{' '}
							array
						</li>
						<li>
							• Adjust <code className='bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded'>
								duration
							</code>{' '}
							and{' '}
							<code className='bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded'>
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
