import { type Components, Streamdown } from 'streamdown'
import { cn } from '@/lib/utils'

// Mirrors src/components/editor.css
const components: Components = {
	h1: ({ className, ...props }) => (
		<h1 className={cn('mt-5 mb-4 font-bold text-3xl', className)} {...props} />
	),
	h2: ({ className, ...props }) => (
		<h2 className={cn('mt-5 mb-4 font-bold text-2xl', className)} {...props} />
	),
	h3: ({ className, ...props }) => (
		<h3 className={cn('mt-5 mb-3 font-bold text-xl', className)} {...props} />
	),
	h4: ({ className, ...props }) => (
		<h4 className={cn('mt-4 mb-2 font-bold text-lg', className)} {...props} />
	),
	h5: ({ className, ...props }) => (
		<h5 className={cn('mt-2 mb-1 font-bold', className)} {...props} />
	),
	h6: ({ className, ...props }) => (
		<h6
			className={cn('mt-2 mb-1 font-bold text-typography-500', className)}
			{...props}
		/>
	),
	p: ({ className, ...props }) => (
		<p className={cn('leading-7', className)} {...props} />
	),
	ul: ({ className, ...props }) => (
		<ul className={cn('my-3 list-disc pl-5', className)} {...props} />
	),
	ol: ({ className, ...props }) => (
		<ol className={cn('my-3 list-decimal pl-5', className)} {...props} />
	),
	hr: ({ className, ...props }) => (
		<hr className={cn('my-5 border-border', className)} {...props} />
	),
	inlineCode: ({ className, ...props }) => (
		<code
			className={cn(
				'rounded-md bg-surface-200 px-1.5 py-1.25 font-mono text-primary-600',
				className,
			)}
			{...props}
		/>
	),
	blockquote: ({ className, ...props }) => (
		<div className='relative my-1.5'>
			<blockquote
				className={cn(
					'pl-4 text-typography-600 before:absolute before:inset-0 before:w-1 before:rounded-sm before:bg-primary-500 before:content-[""]',
					className,
				)}
				{...props}
			/>
		</div>
	),
	pre: ({ className, ...props }) => (
		<pre
			className={cn(
				'my-3 overflow-x-auto rounded-md bg-surface-200 p-4 font-mono text-sm',
				className,
			)}
			{...props}
		/>
	),
}

type ChatMarkdownProps = {
	children: string
	isAnimating?: boolean
}

export const ChatMarkdown = ({ children, isAnimating }: ChatMarkdownProps) => {
	return (
		<Streamdown components={components} isAnimating={isAnimating}>
			{children}
		</Streamdown>
	)
}
