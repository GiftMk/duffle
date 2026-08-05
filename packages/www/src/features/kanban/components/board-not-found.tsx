import { useNavigate } from '@tanstack/react-router'
import { Kanmoji } from './kanmoji'

export const BoardNotFound = () => {
	const navigate = useNavigate()

	return (
		<main className='flex h-full w-full flex-col items-center justify-center gap-6 text-center text-typography-950'>
			<Kanmoji className='font-bold text-4xl'>(◞‸◟；)</Kanmoji>
			<p className='text-pretty text-2xl'>Hmm, that board doesn't exist.</p>
			<button
				type='button'
				onClick={() => navigate({ to: '/' })}
				className='rounded-sm border border-primary-500 px-5 py-2 text-primary-500 transition-all duration-200 hover:scale-110 hover:bg-primary-500/10'
			>
				Take me home
			</button>
		</main>
	)
}
