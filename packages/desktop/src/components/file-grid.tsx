import { useSelector } from '@xstate/store-react'
import { FileCard } from './file-card'
import { LoadingCard } from './loading-card'
import { UploadCard } from './upload-card'
import { useFiles } from '#/hooks/use-file'

export const FileGrid = () => {
	const files = useFiles()

	return (
		<div className='grid grid-cols-4 gap-4'>
			<UploadCard />
			{files.pending.map((file) => (
				<LoadingCard key={file.name} filename={file.name} />
			))}
			{files.persisted.map((file) => (
				<FileCard key={file.name} file={file} />
			))}
		</div>
	)
}
