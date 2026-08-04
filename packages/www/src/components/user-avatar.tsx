import { Avatar, Style } from '@dicebear/core'
import notionistsNeutral from '@dicebear/styles/notionists-neutral.json'
import { cn } from '@/lib/utils'

const style = new Style(notionistsNeutral)

type UserAvatarProps = {
	seed: string
	size?: number
	className?: string
}

export const UserAvatar = ({ seed, size = 19, className }: UserAvatarProps) => {
	const uri = new Avatar(style, { seed, backgroundColor: '#f5f1f2' }).toDataUri()

	return (
		<img
			src={uri}
			alt='user-avatar'
			width={size}
			height={size}
			className={cn('rounded-full', className)}
		/>
	)
}
