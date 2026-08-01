import { createStore } from '@xstate/store'
import { produce } from 'immer'
import { z } from 'zod'
import { idb } from './indexed-db'

export const columnSchema = z.object({
	id: z.uuidv7(),
	title: z.string().min(1),
	tasks: z.uuidv7().array(),
})

export type ColumnEntity = z.infer<typeof columnSchema>

const contextSchema = z.object({
	columns: z.record(z.uuidv7(), columnSchema),
})

type ContextSchema = z.infer<typeof contextSchema>

export const columnsStore = createStore({
	schemas: {
		context: contextSchema,
	},
	context: {
		columns: {},
	},
	on: {
		set: (_, event: { context: ContextSchema }) => {
			return event.context
		},
		add: (context, event: { column: ColumnEntity }) => {
			return produce(context, (draft) => {
				if (draft.columns[event.column.id] !== undefined) {
					throw new Error('Failed to add column, already exists.')
				}

				draft.columns[event.column.id] = event.column
			})
		},
		update: (context, event: { column: ColumnEntity }) => {
			return produce(context, (draft) => {
				if (draft.columns[event.column.id] === undefined) {
					throw new Error('Failed to update column, does not exist.')
				}

				draft.columns[event.column.id] = event.column
			})
		},
		delete: (context, event: { id: string }) => {
			return produce(context, (draft) => {
				if (draft.columns[event.id] === undefined) {
					throw new Error('Failed to delete column, does not exist.')
				}

				delete draft.columns[event.id]
			})
		},
	},
})

columnsStore.subscribe((snapshot) => {
	idb.columns.bulkPut(Object.values(snapshot.context.columns))
})
