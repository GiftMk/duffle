import { Kanmoji } from '@/components/kanmoji'

export const ChatEmptyState = () => {
	return (
		<div className='flex flex-col items-center gap-4 text-center'>
			<Kanmoji className='font-bold text-4xl'>(•̅灬•̅ )</Kanmoji>
			<p className='max-w-xs text-pretty text-typography-600'>
				Sir Duffle, at your service.
			</p>
		</div>
	)
}
