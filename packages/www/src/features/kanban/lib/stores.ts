import { createStore } from '@xstate/store'
import { persist } from '@xstate/store/persist'
import { produce } from 'immer'
import { z } from 'zod'

const STORAGE_KEY = 'duffle-preferences'

const preferencesSchema = z.object({
	activeBoardId: z.uuidv7().nullable(),
})

export const preferencesStore = createStore({
	schemas: {
		context: preferencesSchema,
	},
	context: {
		activeBoardId: null,
	},
	on: {
		setActive: (context, event: { id: string }) => {
			return produce(context, (draft) => {
				draft.activeBoardId = event.id
			})
		},
	},
}).with(
	persist({
		name: STORAGE_KEY,
	}),
)
