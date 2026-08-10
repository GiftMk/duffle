import { Avatar, Style } from '@dicebear/core'
import loreleiNeutral from '@dicebear/styles/lorelei-neutral.json'
import { cn } from '@/lib/utils'

const style = new Style(loreleiNeutral)

const THEME_COLOURS = {
	dark: {
		surface100: '#1f1c1d',
		typography600: '#aca6a7',
	},
	light: {
		surface100: '#f3f2ef',
		typography600: '#7e605f',
	},
} as const

type UserAvatarProps = {
	seed: string
	size?: number
	className?: string
}

export const UserAvatar = ({ seed, size = 19, className }: UserAvatarProps) => {
	const colours = THEME_COLOURS.light

	const uri = new Avatar(style, {
		seed,
		backgroundColor: colours.surface100,
		eyebrowsColor: colours.typography600,
		eyesColor: colours.typography600,
		frecklesColor: colours.typography600,
		glassesColor: colours.typography600,
		mouthColor: colours.typography600,
		noseColor: colours.typography600,
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
