import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Kanmoji } from './kanmoji'

const LoadingDot = ({ className }: { className?: string }) => (
	<p
		className={cn(
			'h-1.5 w-1.5 animate-bounce rounded-full bg-typography-950/70',
			className,
		)}
	/>
)

export const LoadingPage = () => {
	return (
		<div className='relative h-full w-full'>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.5 }}
				className='absolute top-1/3 flex h-full w-full flex-col items-center gap-10 text-typography-950/70'
			>
				<Kanmoji className='animate-bounce font-bold text-4xl [animation-speed:3s]'>
					(„• ֊ •„)੭
				</Kanmoji>
				<div className='flex items-baseline gap-2'>
					<p className='font-bold text-xl'>Loading</p>
					<span className='flex gap-1'>
						<LoadingDot className='[animation-delay:0.3s]' />
						<LoadingDot className='[animation-delay:0.15s]' />
						<LoadingDot />
					</span>
				</div>
			</motion.div>
		</div>
	)
}
