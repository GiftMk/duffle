import { Input } from '@base-ui/react'
import { ImageIcon, UploadSimpleIcon } from '@phosphor-icons/react/dist/ssr'
import { useId, useRef, useState } from 'react'
import { ICON_SIZE_MD } from '@/lib/constants'
import { cn } from '@/lib/utils'

export const ImageUpload = ({
	onUpload,
	onConfirm,
}: {
	onUpload: (file: File) => Promise<string>
	onConfirm: (src: string) => void
}) => {
	const inputId = useId()
	const linkInputRef = useRef<HTMLInputElement>(null)
	const [link, setLink] = useState('')
	const [uploading, setUploading] = useState(false)

	const confirmLink = () => {
		if (!link.trim()) {
			return
		}

		onConfirm(link.trim())
	}

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = event.target.files?.[0]
		if (!file) {
			return
		}

		setUploading(true)
		try {
			const src = await onUpload(file)
			onConfirm(src)
		} finally {
			setUploading(false)
		}
	}

	return (
		<div
			className={cn(
				'flex items-center gap-2 rounded-md border border-surface-400 bg-surface-100 p-2',
				uploading && 'opacity-60',
			)}
		>
			<ImageIcon size={ICON_SIZE_MD} className='shrink-0 text-typography-500' />
			<Input
				ref={linkInputRef}
				value={link}
				onValueChange={setLink}
				onKeyDown={(event) => {
					if (event.key === 'Enter') {
						confirmLink()
					}
				}}
				placeholder='Paste an image link...'
				className='min-w-0 flex-1 bg-transparent text-sm text-typography-700 outline-none placeholder:text-typography-400'
				disabled={uploading}
			/>
			<input
				id={inputId}
				type='file'
				accept='image/*'
				onChange={handleFileChange}
				disabled={uploading}
				className='hidden'
			/>
			<label
				htmlFor={inputId}
				className='flex shrink-0 cursor-pointer items-center gap-1 rounded-md bg-surface-300/50 px-2 py-1 text-typography-600 text-xs hover:bg-surface-300'
			>
				<UploadSimpleIcon size={ICON_SIZE_MD} />
				Upload
			</label>
		</div>
	)
}
