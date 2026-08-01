import type { BoardEntity } from './boards-store'
import { boardsStore } from './boards-store'
import type { ColumnEntity } from './columns-store'
import { columnsStore } from './columns-store'
import { idb } from './indexed-db'
import type { TaskEntity } from './tasks-store'
import { tasksStore } from './tasks-store'

const toRecord = <T extends { id: string }>(
	entities: T[],
): Record<string, T> => {
	const record: Record<string, T> = {}
	for (const entity of entities) {
		record[entity.id] = entity
	}
	return record
}

// Legacy rows created before createdAt/updatedAt existed won't validate
// against the current schemas - backfill them so hydration doesn't throw.
const backfillTimestamps = <
	T extends { createdAt?: string; updatedAt?: string },
>(
	entities: T[],
): T[] => {
	const now = new Date().toISOString()
	return entities.map((entity) => ({
		...entity,
		createdAt: entity.createdAt ?? now,
		updatedAt: entity.updatedAt ?? now,
	}))
}

let hydratePromise: Promise<void> | undefined

export const hydrateStores = (): Promise<void> => {
	if (!hydratePromise) {
		hydratePromise = (async () => {
			const [boards, columns, tasks] = await Promise.all([
				idb.boards.toArray(),
				idb.columns.toArray(),
				idb.tasks.toArray(),
			])

			boardsStore.trigger.set({
				context: {
					boards: toRecord(backfillTimestamps<BoardEntity>(boards)),
					active: null,
				},
			})
			columnsStore.trigger.set({
				context: {
					columns: toRecord(backfillTimestamps<ColumnEntity>(columns)),
				},
			})
			tasksStore.trigger.set({
				context: { tasks: toRecord(backfillTimestamps<TaskEntity>(tasks)) },
			})
		})()
	}

	return hydratePromise
}
