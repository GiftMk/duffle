import { createStore } from '@xstate/store'
import { produce } from 'immer'
import { z } from 'zod'
import { idb } from './indexed-db'

export const boardSchema = z.object({
	id: z.uuidv7(),
	title: z.string().min(1),
	columns: z.uuidv7().array(),
})

export type BoardEntity = z.infer<typeof boardSchema>

const contextSchema = z.object({
	boards: z.record(z.uuidv7(), boardSchema),
	active: z.uuidv7().nullable(),
})

type ContextSchema = z.infer<typeof contextSchema>

export const boardsStore = createStore({
	schemas: {
		context: contextSchema,
	},
	context: {
		boards: {},
		active: null,
	},
	on: {
		set: (_, event: { context: ContextSchema }) => {
			return event.context
		},
		setActive: (context, event: { id: string }) => {
			return produce(context, (draft) => {
				draft.active = event.id
			})
		},
		add: (context, event: { board: BoardEntity }) => {
			return produce(context, (draft) => {
				if (draft.boards[event.board.id] !== undefined) {
					throw new Error('Failed to add board, already exists.')
				}

				draft.boards[event.board.id] = event.board
			})
		},
		update: (context, event: { board: BoardEntity }) => {
			return produce(context, (draft) => {
				if (draft.boards[event.board.id] === undefined) {
					throw new Error('Failed to update board, does not exist.')
				}

				draft.boards[event.board.id] = event.board
			})
		},
		delete: (context, event: { id: string }) => {
			return produce(context, (draft) => {
				if (draft.boards[event.id] === undefined) {
					throw new Error('Failed to delete board, does not exist.')
				}

				delete draft.boards[event.id]
			})
		},
	},
})

boardsStore.subscribe((snapshot) => {
	idb.boards.bulkPut(Object.values(snapshot.context.boards))
})
