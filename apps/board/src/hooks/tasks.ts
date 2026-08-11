import { utcNow } from '@duffle/utils'
import { eq, useLiveQuery } from '@tanstack/react-db'
import { generateKeyBetween } from 'fractional-indexing'
import type { Draft } from 'immer'
import { uuidv7 } from 'uuidv7'
import { columnsCollection, tasksCollection } from '@/lib/collections'
import type { TaskEntity } from '@/lib/schemas'
import { searchWorker, taskToSearchItem } from '@/lib/search'

const indexTask = (task: TaskEntity) => {
	const boardId = columnsCollection.get(task.columnId)?.boardId
	searchWorker.update([taskToSearchItem(task, boardId)])
}

const getPositionBetween = (
	prev?: string | null,
	next?: string | null,
): string => {
	return generateKeyBetween(prev ?? null, next ?? null)
}

const getSortedTasks = (columnId: string, tasks: TaskEntity[]) =>
	tasks
		.filter((task) => task.columnId === columnId)
		.sort((a, b) =>
			a.position < b.position ? -1 : a.position > b.position ? 1 : 0,
		)

export const useTasks = (columnId: string) => {
	const { data } = useLiveQuery((q) =>
		q
			.from({ task: tasksCollection })
			.where(({ task }) => eq(task.columnId, columnId)),
	)
	return getSortedTasks(columnId, data)
}

export const useAllTasks = () => {
	const { data } = useLiveQuery((q) =>
		q
			.from({ task: tasksCollection })
			.orderBy(({ task }) => task.updatedAt, 'desc'),
	)
	return data
}

export const useUpdateTask = () => {
	return (id: string, recipe: (draft: Draft<TaskEntity>) => void) => {
		const task = tasksCollection.get(id)
		if (!task) throw new Error(`Task with id '${id}' not found`)

		tasksCollection.update(id, (draft) => {
			recipe(draft)
			draft.updatedAt = utcNow()
		})

		const updated = tasksCollection.get(id)
		if (updated) indexTask(updated)
	}
}

export const useDeleteTask = () => {
	return (id: string) => {
		const task = tasksCollection.get(id)
		if (!task) throw new Error(`Task with id '${id}' not found`)

		tasksCollection.delete(id)
	}
}

export const useAddTask = () => {
	return (columnId: string, title: string, description?: string) => {
		const timestamp = utcNow()
		const tasks = tasksCollection.toArray
		const lastTask = getSortedTasks(columnId, tasks).at(-1)
		const position = getPositionBetween(lastTask?.position, null)

		const task: TaskEntity = {
			id: uuidv7(),
			columnId,
			title,
			description,
			createdAt: timestamp,
			updatedAt: timestamp,
			position,
		}

		tasksCollection.insert(task)
		indexTask(task)
	}
}

type DndTarget = { columnId: string; index: number }

export const useMoveTask = () => {
	return (source: DndTarget, destination: DndTarget) => {
		const tasks = tasksCollection.toArray

		// Load and sort source and destination columns
		const sourceTasks = getSortedTasks(source.columnId, tasks)
		const sourceTask = sourceTasks[source.index]

		if (!sourceTask) {
			throw new Error('Failed to move task, could not find source task.')
		}

		const timestamp = utcNow()

		// Filter out source task from destination to match drop-index semantics
		const destinationTasks =
			source.columnId === destination.columnId
				? sourceTasks.filter((t) => t.id !== sourceTask.id)
				: getSortedTasks(destination.columnId, tasks)

		const prevTask = destinationTasks[destination.index - 1]
		const nextTask = destinationTasks[destination.index]

		// Compute new position as a string rank between neighbors
		const newPosition = getPositionBetween(
			prevTask?.position ?? null,
			nextTask?.position ?? null,
		)

		tasksCollection.update(sourceTask.id, (draft) => {
			draft.columnId = destination.columnId
			draft.position = newPosition
			draft.updatedAt = timestamp
		})

		const updated = tasksCollection.get(sourceTask.id)
		if (updated) indexTask(updated)
	}
}
