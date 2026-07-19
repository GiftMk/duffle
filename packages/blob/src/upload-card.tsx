import { UploadSimpleIcon } from '@phosphor-icons/react'

const MESSAGES = [
	`I'm trustworthy`,
	`You're hard-drive is sore`,
	'The cloud needs it',
	'Your SSD will thank you',
	`You're secret's safe with me`,
	`I won't tell anybody`,
	'Lemme take care of that',
	`I'll never fail you`,
]

const randInt = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

const randItem = <T,>(array: T[]): T | undefined => {
	if (!array.length) {
		return
	}

	const index = randInt(0, array.length - 1)
	return array[index]
}

export const UploadCard = () => {
	const message = randItem(MESSAGES)

	return (
		<div className='border border-surface-400 text-typography-500 border-dashed border-3 rounded-md flex flex-col gap-6 w-full p-4 group hover:bg-surface-50 transition-colors duration-50'>
			<div className='pt-8 flex opacity-50 w-full grow justify-center group-hover:scale-110 duration-50 transition-all group-hover:opacity-100'>
				<UploadSimpleIcon weight='thin' size={120} />
			</div>
			<div className='flex flex-col gap-4'>
				<p className='font-bold text-lg'>
					Upload <span className='underline'>HERE</span>
				</p>
				<p className='text-sm'>{message}</p>
			</div>
		</div>
	)
}
