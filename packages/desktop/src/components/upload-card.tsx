import { UploadSimpleIcon } from '@phosphor-icons/react'
import { useDropzone } from 'react-dropzone'
import { useUpload } from '#/hooks/use-upload'
import {
	FileCardContainer,
	FileCardContent,
	FileCardCover,
	FileCardHeading,
	FileCardText,
} from './file-card'

export const UploadCard = () => {
	const { handleUpload } = useUpload()
	const { getRootProps, getInputProps } = useDropzone({
		onDrop: handleUpload,
	})

	return (
		<FileCardContainer
			className='border-3 border-dashed text-typography-500'
			{...getRootProps()}
		>
			<input {...getInputProps()} />
			<FileCardCover className='items-center'>
				<UploadSimpleIcon weight='thin' size={64} />
			</FileCardCover>
			<FileCardContent>
				<FileCardHeading>
					Upload <span className='underline'>HERE</span>
				</FileCardHeading>
				<FileCardText>The place is looking empty...</FileCardText>
			</FileCardContent>
		</FileCardContainer>
	)
}
