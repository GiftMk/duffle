import { createStore } from '@xstate/store'
import { persist } from '@xstate/store/persist'
import { useSelector } from '@xstate/store-react'
import z from 'zod'

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
			seeds: seedsSchema,
		}),
	},
	context: {
		seeds: generateSeeds(),
	},
	on: {
		randomise: (_) => ({
			seeds: generateSeeds(),
		}),
	},
}).with(
	persist({
		name: 'duffle-avatar-style',
	}),
)

export const useAvatarStyle = () => {
	const seeds = useSelector(avatarStyleStore, (store) => store.context.seeds)
	const randomise = () => {
		avatarStyleStore.trigger.randomise()
	}

	return { seeds, randomise }
}
