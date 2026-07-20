import { createStore } from '@xstate/store'
import { produce } from 'immer'
import z from 'zod'

export const pendingFileSchema = z.object({
	name: z.string().min(1),
	size: z.number(),
	progress: z.number(),
})

export type PendingFile = z.infer<typeof pendingFileSchema>

export const persistedFileSchema = z.object({
	name: z.string().min(1),
	size: z.number(),
	uploadedAt: z.iso.datetime(),
})

export type PersistedFile = z.infer<typeof persistedFileSchema>

const contextSchema = z.object({
	pending: z.record(z.string(), pendingFileSchema),
	persisted: z.record(z.string(), persistedFileSchema),
})

export const fileStore = createStore({
	schemas: {
		context: contextSchema,
	},
	context: {
		pending: {},
		persisted: {},
	},
	on: {
		updateProgress: (
			context,
			event: { filename: string; progress: number },
		) => {
			return produce(context, (draft) => {
				const file = draft.pending[event.filename]

				if (!file) {
					return
				}

				file.progress = event.progress

				if (file.progress === 100) {
					const { [file.name]: _, ...rest } = draft.pending
					draft.pending = rest
					const persistedFile = {
						...file,
						uploadedAt: new Date().toISOString(),
					}
					draft.persisted = {
						...draft.persisted,
						[persistedFile.name]: persistedFile,
					}
				}
			})
		},
		setPersisted: (context, event: { files: PersistedFile[] }) => {
			return produce(context, (draft) => {
				draft.persisted = Object.fromEntries(
					event.files.map((file) => [file.name, file]),
				)
			})
		},
		setPending: (context, event: { files: PendingFile[] }) => {
			return produce(context, (draft) => {
				draft.pending = Object.fromEntries(
					event.files.map((file) => [file.name, file]),
				)
			})
		},
	},
})

export const useFiles = () => {}
