import { motion } from 'framer-motion'

const DOT_CLASSNAME = 'h-1.5 w-1.5 rounded-full bg-current'
const DOT_ANIMATE = { opacity: [0.3, 1, 0.3] }

export const ChatThinking = () => {
	return (
		<div className='flex items-center gap-1.5 text-typography-500'>
			<motion.span
				className={DOT_CLASSNAME}
				animate={DOT_ANIMATE}
				transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
			/>
			<motion.span
				className={DOT_CLASSNAME}
				animate={DOT_ANIMATE}
				transition={{
					duration: 1,
					repeat: Number.POSITIVE_INFINITY,
					delay: 0.15,
				}}
			/>
			<motion.span
				className={DOT_CLASSNAME}
				animate={DOT_ANIMATE}
				transition={{
					duration: 1,
					repeat: Number.POSITIVE_INFINITY,
					delay: 0.3,
				}}
			/>
		</div>
	)
}
