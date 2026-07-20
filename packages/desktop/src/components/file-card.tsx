import type { ComponentProps } from 'react'
import { cn, createAvatar, prettyTimestamp } from '#/lib/utils'
import type { PersistedFile } from '#/state/file-store'

type FileCardProps = {
	file: PersistedFile
}

export const FileCardContainer = ({
	className,
	...props
}: ComponentProps<'div'>) => {
	return (
		<div
			className={cn(
				'group flex h-72 w-full flex-col gap-6 rounded-md border border-surface-400 p-4 transition-colors duration-50 hover:bg-surface-50',
				className,
			)}
			{...props}
		/>
	)
}

export const FileCardCover = ({
	className,
	...props
}: ComponentProps<'div'>) => {
	return (
		<div
			className={cn(
				'flex min-h-0 grow justify-center opacity-80 transition-all duration-50 group-hover:scale-110 group-hover:opacity-100',
				className,
			)}
			{...props}
		/>
	)
}

export const FileCardContent = ({
	className,
	...props
}: ComponentProps<'div'>) => {
	return <div className={cn('flex flex-col gap-4', className)} {...props} />
}

export const FileCardHeading = ({
	className,
	...props
}: ComponentProps<'p'>) => {
	return (
		<p className={cn('line-clamp-1 font-bold text-lg', className)} {...props} />
	)
}

export const FileCardText = ({ className, ...props }: ComponentProps<'p'>) => {
	return <p className={cn('line-clamp-1 text-sm', className)} {...props} />
}

export const FileCard = ({ file }: FileCardProps) => {
	const avatar = createAvatar(file.name)

	return (
		<FileCardContainer>
			<FileCardCover>
				<img src={avatar} alt='Avatar' className='overflow-hidden rounded-md' />
			</FileCardCover>
			<FileCardContent>
				<FileCardHeading>{file.name}</FileCardHeading>
				<FileCardText>
					Uploaded on {prettyTimestamp(file.uploadedAt)}
				</FileCardText>
			</FileCardContent>
		</FileCardContainer>
	)
}
