import { UploadSimpleIcon } from '@phosphor-icons/react'
import { useRouter } from '@tanstack/react-router'
import { useDropzone } from 'react-dropzone'
import { uploadFiles } from '#/lib/upload-files'
import {
	FileCardContainer,
	FileCardContent,
	FileCardCover,
	FileCardHeading,
	FileCardText,
} from './file-card'
import { pendingFilesAtom } from '#/state/pending-files'
import { fileComparator } from '#/lib/utils'

export const UploadCard = () => {
	const router = useRouter()
	const { getRootProps, getInputProps } = useDropzone({
		onDrop: async (files) => {
			const now = new Date().toISOString()
			pendingFilesAtom.set(
				files
					.map((file) => ({ name: file.name, uploadedAt: now }))
					.sort((a, b) => fileComparator(a, b)),
			)

			try {
				await uploadFiles(...files)
				router.invalidate()
			} finally {
				pendingFilesAtom.set([])
			}
		},
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
