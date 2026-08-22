import { type HTMLMotionProps, motion } from 'framer-motion'
import type { ReactNode } from 'react'

export type MotionTarget = Record<string, number | string>

type AnimationProps = {
	children: ReactNode
	className?: string
	initial?: MotionTarget
	animate?: MotionTarget
	transition?: HTMLMotionProps<'div'>['transition']
}

export const FadeIn = ({
	children,
	className,
	initial,
	animate,
	transition,
}: AnimationProps) => (
	<motion.div
		initial={{ opacity: 0, ...initial }}
		animate={{ opacity: 1, ...animate }}
		transition={{ duration: 0.5, ...transition }}
		className={className}
	>
		{children}
	</motion.div>
)

export const SpringPopIn = ({
	children,
	className,
	initial,
	animate,
	transition,
}: AnimationProps) => (
	<motion.div
		initial={{ opacity: 0, scale: 0.8, y: -20, ...initial }}
		animate={{ opacity: 1, scale: 1, y: 0, ...animate }}
		transition={{
			type: 'spring',
			duration: 0.6,
			bounce: 0.6,
			delay: 0.3,
			...transition,
		}}
		className={className}
	>
		{children}
	</motion.div>
)
