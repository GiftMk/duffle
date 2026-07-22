import { Avatar, Style } from '@dicebear/core'
import type { ComponentProps } from 'react'
import { useAvatarStyle } from '@/hooks/use-avatar-style'

const createAvatar = (
	seed: string,
	size = 120,
	backgroundColor = '#FFFFFF00',
) => {
	const { config } = useAvatarStyle()

	return new Avatar(new Style(config), {
		seed,
		size: size,
		backgroundColor,
	}).toDataUri()
}

type CharacterProps = { seed: string } & ComponentProps<'img'>

const Character = ({ seed, ...props }: CharacterProps) => {
	return <img src={createAvatar(seed)} alt='Avatar' {...props} />
}

export const SplashScreen = () => {
	const { seeds } = useAvatarStyle()
	return (
		<div className='absolute inset-0 flex h-full w-full flex-wrap items-end justify-between opacity-20'>
			<Character seed={seeds[0]} className='absolute top-20 left-90' />
			<Character seed={seeds[1]} className='absolute top-40 right-40' />
			<Character seed={seeds[2]} className='absolute bottom-20 left-60' />
			<Character seed={seeds[3]} className='absolute top-100 left-30' />
			<Character seed={seeds[4]} className='absolute right-75 bottom-50' />
		</div>
	)
}
