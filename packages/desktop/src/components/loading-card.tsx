import { createAvatar } from '#/lib/utils'
import {
	FileCardContainer,
	FileCardContent,
	FileCardCover,
	FileCardHeading,
} from './file-card'
import { useFile } from '#/hooks/use-file'

type LoadingCardProps = {
	filename: string
}

type ProgressBarProps = {
	progress: number
}

const ProgressBar = ({ progress }: ProgressBarProps) => {
	return (
		<div className='relative h-3 w-full overflow-clip rounded-full bg-surface-200'>
			<span
				className='absolute h-full bg-primary-500'
				style={{ width: `${progress}%` }}
			/>
		</div>
	)
}

export const LoadingCard = ({ filename }: LoadingCardProps) => {
	const file = useFile(filename)
	const avatar = createAvatar(file.name)

	return (
		<FileCardContainer>
			<FileCardCover>
				<img src={avatar} alt='Avatar' className='overflow-hidden rounded-md' />
			</FileCardCover>
			<FileCardContent>
				<FileCardHeading>{file.name}</FileCardHeading>
				<div className='py-1'>
					<ProgressBar progress={file.progress} />
				</div>
			</FileCardContent>
		</FileCardContainer>
	)
}
