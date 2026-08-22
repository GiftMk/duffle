import { Avatar, Style } from '@dicebear/core'
import loreleiNeutral from '@dicebear/styles/lorelei-neutral.json'
import { cn } from '@/lib/utils'

const style = new Style(loreleiNeutral)

const THEME_COLOURS = {
	surface100: '#f3f2ef',
	typography600: '#7e605f',
} as const

type UserAvatarProps = {
	seed: string
	size?: number
	className?: string
}

export const UserAvatar = ({ seed, size = 19, className }: UserAvatarProps) => {
	const uri = new Avatar(style, {
		seed,
		backgroundColor: THEME_COLOURS.surface100,
		eyebrowsColor: THEME_COLOURS.typography600,
		eyesColor: THEME_COLOURS.typography600,
		frecklesColor: THEME_COLOURS.typography600,
		glassesColor: THEME_COLOURS.typography600,
		mouthColor: THEME_COLOURS.typography600,
		noseColor: THEME_COLOURS.typography600,
	}).toDataUri()

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
