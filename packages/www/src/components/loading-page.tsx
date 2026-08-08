import { motion } from 'framer-motion'
import { Kanmoji } from './kanmoji'

export const LoadingPage = () => {
	return (
		<div className='relative h-full w-full animate-pulse'>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.5 }}
				className='absolute top-1/3 flex h-full w-full flex-col items-center gap-10 text-typography-950/70'
			>
				<Kanmoji className='font-bold text-4xl [animation-speed:3s]'>
					(„• ֊ •„)੭
				</Kanmoji>
				<p className='text-lg'>Almost there...</p>
			</motion.div>
		</div>
	)
}
