import { createStore } from '@xstate/store'
import { produce } from 'immer'
import { z } from 'zod'
import { idb } from './indexed-db'

export const taskSchema = z.object({
	id: z.uuidv7(),
	title: z.string().min(1),
	description: z.string().optional(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
})

export type TaskEntity = z.infer<typeof taskSchema>

const contextSchema = z.object({
	tasks: z.record(z.uuidv7(), taskSchema),
})

type ContextSchema = z.infer<typeof contextSchema>

export const tasksStore = createStore({
	schemas: {
		context: contextSchema,
	},
	context: {
		tasks: {},
	},
	on: {
		set: (_, event: { context: ContextSchema }) => {
			return event.context
		},
		add: (
			context,
			event: { task: Omit<TaskEntity, 'createdAt' | 'updatedAt'> },
		) => {
			return produce(context, (draft) => {
				if (draft.tasks[event.task.id] !== undefined) {
					throw new Error('Failed to add task, already exists.')
				}

				const now = new Date().toISOString()
				draft.tasks[event.task.id] = {
					...event.task,
					createdAt: now,
					updatedAt: now,
				}
			})
		},
		update: (context, event: { task: TaskEntity }) => {
			return produce(context, (draft) => {
				if (draft.tasks[event.task.id] === undefined) {
					throw new Error('Failed to update task, does not exist.')
				}

				draft.tasks[event.task.id] = {
					...event.task,
					updatedAt: new Date().toISOString(),
				}
			})
		},
		delete: (context, event: { id: string }) => {
			return produce(context, (draft) => {
				if (draft.tasks[event.id] === undefined) {
					throw new Error('Failed to delete task, does not exist.')
				}

				delete draft.tasks[event.id]
			})
		},
	},
})

tasksStore.subscribe(async (snapshot) => {
	const inMemoryIds = new Set(Object.keys(snapshot.context.tasks))
	const persistedIds = await idb.tasks.toCollection().primaryKeys()
	const staleIds = persistedIds.filter((id) => !inMemoryIds.has(id))

	if (staleIds.length > 0) {
		await idb.tasks.bulkDelete(staleIds)
	}

	await idb.tasks.bulkPut(Object.values(snapshot.context.tasks))
})
