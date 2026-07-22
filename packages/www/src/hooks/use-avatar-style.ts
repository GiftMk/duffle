import adventurer from '@dicebear/styles/adventurer.json'
import bigSmile from '@dicebear/styles/big-smile.json'
import croodles from '@dicebear/styles/croodles.json'
import croodlesNeutral from '@dicebear/styles/croodles-neutral.json'
import lorelei from '@dicebear/styles/lorelei.json'
import loreleiNeutral from '@dicebear/styles/lorelei-neutral.json'
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
	'adventurer',
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
		case 'adventurer':
			return adventurer
		case 'notionists-neutral':
			return notionistNeutral
		case 'big-smile':
			return bigSmile
		case 'thumbs':
			return thumbs
	}
}

const seedsSchema = z.tuple([
	z.string(),
	z.string(),
	z.string(),
	z.string(),
	z.string(),
])

const generateSeeds = (): z.infer<typeof seedsSchema> => {
	return [
		crypto.randomUUID(),
		crypto.randomUUID(),
		crypto.randomUUID(),
		crypto.randomUUID(),
		crypto.randomUUID(),
	]
}

const avatarStyleStore = createStore({
	schemas: {
		context: z.object({
			style: avatarStyleSchema,
			seeds: seedsSchema,
		}),
	},
	context: {
		style: 'big-smile',
		seeds: generateSeeds(),
	},
	on: {
		setStyle: (_, event: { style: AvatarStyle }) => ({
			style: event.style,
			seeds: generateSeeds(),
		}),
	},
}).with(
	persist({
		name: 'duffle-avatar-style',
	}),
)

export const useAvatarStyle = () => {
	const { style, seeds } = useSelector(
		avatarStyleStore,
		(store) => store.context,
	)
	const config = getStyleJson(style)

	const setStyle = (style: AvatarStyle) => {
		avatarStyleStore.trigger.setStyle({ style })
	}

	return { style, seeds, config, setStyle, styles: avatarStyles }
}
