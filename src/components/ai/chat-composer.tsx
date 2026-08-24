import { ArrowUpIcon } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import type { KeyboardEvent } from 'react'
import { useEffect, useRef } from 'react'
import { ICON_SIZE_MD } from '@/lib/constants'
import { cn } from '@/lib/utils'

const MAX_TEXTAREA_HEIGHT_PX = 160
const CHAT_COMPOSER_LAYOUT_ID = 'chat-composer'

type ChatComposerProps = {
	input: string
	setInput: (input: string) => void
	onSubmit: () => void
	canSubmit: boolean
}

export const ChatComposer = ({
	input,
	setInput,
	onSubmit,
	canSubmit,
}: ChatComposerProps) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	useEffect(() => {
		textareaRef.current?.focus()
	}, [])

	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional
	useEffect(() => {
		const textarea = textareaRef.current
		if (!textarea) {
			return
		}

		textarea.style.height = 'auto'
		textarea.style.height = `${Math.min(textarea.scrollHeight, MAX_TEXTAREA_HEIGHT_PX)}px`
	}, [input])

	const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault()
			onSubmit()
		}
	}

	return (
		<motion.div
			layout
			layoutId={CHAT_COMPOSER_LAYOUT_ID}
			transition={{ type: 'spring', duration: 0.5, bounce: 0.15 }}
			className='mx-auto flex w-full max-w-3xl items-center gap-3 rounded-md border border-surface-400 bg-surface-50 px-4 py-3'
		>
			<textarea
				ref={textareaRef}
				rows={1}
				value={input}
				onChange={(event) => setInput(event.target.value)}
				onKeyDown={handleKeyDown}
				placeholder='Ask away...'
				className='max-h-40 w-full resize-none bg-transparent text-lg focus:outline-none'
			/>
			<button
				type='button'
				onClick={onSubmit}
				disabled={!canSubmit}
				className={cn(
					'flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-500 text-typography-100 transition-opacity',
					{ 'opacity-40': !canSubmit },
				)}
			>
				<ArrowUpIcon size={ICON_SIZE_MD} weight='bold' />
			</button>
		</motion.div>
	)
}
