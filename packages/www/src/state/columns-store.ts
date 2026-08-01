import { createStore } from '@xstate/store'
import { produce } from 'immer'
import { z } from 'zod'
import { idb } from './indexed-db'

export const columnSchema = z.object({
	id: z.uuidv7(),
	title: z.string().min(1),
	tasks: z.uuidv7().array(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
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
		add: (
			context,
			event: { column: Omit<ColumnEntity, 'createdAt' | 'updatedAt'> },
		) => {
			return produce(context, (draft) => {
				if (draft.columns[event.column.id] !== undefined) {
					throw new Error('Failed to add column, already exists.')
				}

				const now = new Date().toISOString()
				draft.columns[event.column.id] = {
					...event.column,
					createdAt: now,
					updatedAt: now,
				}
			})
		},
		update: (context, event: { column: ColumnEntity }) => {
			return produce(context, (draft) => {
				if (draft.columns[event.column.id] === undefined) {
					throw new Error('Failed to update column, does not exist.')
				}

				draft.columns[event.column.id] = {
					...event.column,
					updatedAt: new Date().toISOString(),
				}
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

columnsStore.subscribe(async (snapshot) => {
	const inMemoryIds = new Set(Object.keys(snapshot.context.columns))
	const persistedIds = await idb.columns.toCollection().primaryKeys()
	const staleIds = persistedIds.filter((id) => !inMemoryIds.has(id))

	if (staleIds.length > 0) {
		await idb.columns.bulkDelete(staleIds)
	}

	await idb.columns.bulkPut(Object.values(snapshot.context.columns))
})
