import { createAvatar } from '#/lib/utils'
import {
	FileCardContainer,
	FileCardCover,
	FileCardContent,
	FileCardHeading,
	FileCardText,
} from './file-card'

type LoadingCardProps = {
	filename: string
}

export const LoadingCard = ({ filename }: LoadingCardProps) => {
	const avatar = createAvatar(filename)

	return (
		<FileCardContainer className='animate-pulse'>
			<FileCardCover className='opacity-50'>
				<img src={avatar} alt='Avatar' className='overflow-hidden rounded-md' />
			</FileCardCover>
			<FileCardContent>
				<FileCardHeading>{filename}</FileCardHeading>
				<FileCardText>Uploading...</FileCardText>
			</FileCardContent>
		</FileCardContainer>
	)
}
