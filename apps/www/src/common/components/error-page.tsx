import { Kanmoji } from './kanmoji'

export const ErrorPage = () => {
	return (
		<div className='relative h-full w-full'>
			<div className='absolute top-1/3 flex h-full w-full flex-col items-center gap-10 text-typography/70'>
				<Kanmoji className='font-bold text-4xl'>(｡•́︿•̀｡)(╥﹏╥)</Kanmoji>
				<div className='flex items-baseline gap-2'>
					<p className='font-bold text-xl'>
						Whoops! Something wasn't right there
					</p>
				</div>
			</div>
		</div>
	)
}
