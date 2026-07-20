import { useFiles } from '#/hooks/use-file'
import { FileCard } from './file-card'
import { LoadingCard } from './loading-card'
import { UploadCard } from './upload-card'

export const FileGrid = () => {
	const files = useFiles()

	return (
		<ul className='grid grid-cols-4 gap-4'>
			<UploadCard key={'upload-card'} />
			{files.pending.map((file) => (
				<LoadingCard key={file.name} filename={file.name} />
			))}
			{files.persisted.map((file) => (
				<FileCard key={file.name} file={file} />
			))}
		</ul>
	)
}
