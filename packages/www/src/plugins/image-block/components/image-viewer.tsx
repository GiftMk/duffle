import {
	ChatCircleIcon,
	ImageBrokenIcon,
	XIcon,
} from '@phosphor-icons/react/dist/ssr'
import { useState } from 'react'
import { ICON_SIZE_MD } from '@/lib/constants'
import { cn } from '@/lib/utils'

export const ImageViewer = ({
	src,
	caption,
	selected,
	onCaptionChange,
	onRemove,
}: {
	src: string
	caption: string
	selected: boolean
	onCaptionChange: (caption: string) => void
	onRemove: () => void
}) => {
	const [showCaption, setShowCaption] = useState(Boolean(caption))
	const [failedToLoad, setFailedToLoad] = useState(false)

	return (
		<div className='group relative'>
			<div className='absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
				<button
					type='button'
					onClick={() => setShowCaption((prev) => !prev)}
					className='rounded-md bg-surface-950/60 p-1.5 text-surface-100 hover:bg-surface-950/80'
				>
					<ChatCircleIcon size={ICON_SIZE_MD} />
				</button>
				<button
					type='button'
					onClick={onRemove}
					className='rounded-md bg-surface-950/60 p-1.5 text-surface-100 hover:bg-surface-950/80'
				>
					<XIcon size={ICON_SIZE_MD} />
				</button>
			</div>
			{failedToLoad ? (
				<div className='flex flex-col items-center gap-2 rounded-md border border-surface-400 bg-surface-100 p-6 text-center'>
					<ImageBrokenIcon
						size={ICON_SIZE_MD * 1.5}
						className='text-typography-400'
					/>
					<p className='text-sm text-typography-500'>
						This image format isn't supported by your browser. Try converting it
						to JPEG or PNG.
					</p>
				</div>
			) : (
				<img
					src={src}
					alt={caption}
					onError={() => setFailedToLoad(true)}
					className={cn('rounded-md', selected && 'ring-2 ring-primary-500')}
				/>
			)}
			{showCaption && (
				<input
					value={caption}
					onChange={(event) => onCaptionChange(event.target.value)}
					placeholder='Image caption'
					className='mt-1.5 w-full bg-transparent text-center text-sm text-typography-500 outline-none placeholder:text-typography-400'
				/>
			)}
		</div>
	)
}
