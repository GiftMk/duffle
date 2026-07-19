import { pendingFilesAtom } from '#/state/pending-files'
import type { FileAsset } from '#/types'
import { FileCard } from './file-card'
import { LoadingCard } from './loading-card'
import { UploadCard } from './upload-card'
import { useAtom } from '@xstate/store-react'

type FileGridProps = {
	files: FileAsset[]
}

export const FileGrid = ({ files }: FileGridProps) => {
	const pendingFiles = useAtom(pendingFilesAtom)

	return (
		<div className='grid grid-cols-4 gap-4'>
			<UploadCard />
			{pendingFiles.map((file) => (
				<LoadingCard key={file.name} filename={file.name} />
			))}
			{files.map((file) => (
				<FileCard key={file.name} file={file} />
			))}
		</div>
	)
}
