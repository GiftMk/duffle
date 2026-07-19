import { Style, Avatar } from '@dicebear/core'
import artStyle from '@dicebear/styles/notionists-neutral.json' with {
	type: 'json',
}
import type { File } from './types'

const style = new Style(artStyle)

const prettyTimestamp = (timestamp: string) => {
	const date = new Date(timestamp)
	return new Intl.DateTimeFormat('en-US', {
		dateStyle: 'long',
		timeStyle: 'short',
	}).format(date)
}

const AVATAR_SIZE_PX = 184
const AVATAR_BG_COLOUR = 'ffffff00'

type FileCardProps = {
	file: File
}

export const FileCard = ({ file }: FileCardProps) => {
	const avatar = new Avatar(style, {
		seed: file.id,
		size: AVATAR_SIZE_PX,
		backgroundColor: AVATAR_BG_COLOUR,
	}).toDataUri()

	return (
		<div className='border border-surface-400 rounded-md flex flex-col gap-6 w-full p-4 group hover:bg-surface-50 transition-colors duration-50'>
			<div className='flex opacity-50 grow min-h-0 justify-center group-hover:scale-110 duration-50 transition-all group-hover:opacity-100'>
				<img src={avatar} alt='Avatar' className='rounded-md overflow-hidden' />
			</div>
			<div className='flex flex-col gap-4 mx-auto'>
				<p className='font-bold text-lg'>{file.name}</p>
				<p className='text-sm'>
					Uploaded on {prettyTimestamp(file.uploadedAt)}
				</p>
			</div>
		</div>
	)
}
