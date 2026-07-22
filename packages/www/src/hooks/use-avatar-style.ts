import bigSmile from '@dicebear/styles/big-smile.json'
import croodles from '@dicebear/styles/croodles.json'
import croodlesNeutral from '@dicebear/styles/croodles-neutral.json'
import lorelei from '@dicebear/styles/lorelei.json'
import loreleiNeutral from '@dicebear/styles/lorelei-neutral.json'
import notionist from '@dicebear/styles/notionists.json'
import notionistNeutral from '@dicebear/styles/notionists-neutral.json'
import thumbs from '@dicebear/styles/thumbs.json'
import { createStore } from '@xstate/store'
import { persist } from '@xstate/store/persist'
import { useSelector } from '@xstate/store-react'
import z from 'zod'

export const avatarStyles = [
	'lorelei',
	'lorelei-neutral',
	'croodles',
	'croodles-neutral',
	'notionists',
	'notionists-neutral',
	'big-smile',
	'thumbs',
] as const

const avatarStyleSchema = z.enum(avatarStyles)

type AvatarStyle = z.infer<typeof avatarStyleSchema>

const getStyleJson = (style: AvatarStyle) => {
	switch (style) {
		case 'lorelei':
			return lorelei
		case 'lorelei-neutral':
			return loreleiNeutral
		case 'croodles':
			return croodles
		case 'croodles-neutral':
			return croodlesNeutral
		case 'notionists':
			return notionist
		case 'notionists-neutral':
			return notionistNeutral
		case 'big-smile':
			return bigSmile
		case 'thumbs':
			return thumbs
	}
}

const avatarStyleStore = createStore({
	schemas: {
		context: z.object({
			current: avatarStyleSchema,
		}),
	},
	context: {
		current: 'big-smile',
	},
	on: {
		setStyle: (_, event: { style: AvatarStyle }) => ({ current: event.style }),
	},
}).with(
	persist({
		name: 'duffle-avatar-style',
	}),
)

export const useAvatarStyle = () => {
	const style = useSelector(avatarStyleStore, (store) => store.context.current)
	const config = getStyleJson(style)

	const setStyle = (style: AvatarStyle) => {
		avatarStyleStore.trigger.setStyle({ style })
	}

	return { style, config, setStyle, styles: avatarStyles }
}
