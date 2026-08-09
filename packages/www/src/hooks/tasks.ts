import { generateKeyBetween } from 'fractional-indexing'
import {
	queryOptions,
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from '@tanstack/react-query'
import { type Draft, produce } from 'immer'
import { uuidv7 } from 'uuidv7'
import { removeItem, upsertItem, upsertItems } from '@/lib/query-list'
import { type TaskEntity, taskSchema } from '@/lib/schemas'
import { utcNow } from '@/lib/utils'
import {
	createTaskFn,
	deleteTaskFn,
	getTasksFn,
	updateTaskFn,
} from '@/server/tasks'

export const tasksQuery = queryOptions({
	queryKey: ['tasks'],
	queryFn: async () => taskSchema.array().parse(await getTasksFn()),
	staleTime: Infinity,
})

const getPositionBetween = (prev?: string | null, next?: string | null): string => {
	return generateKeyBetween(prev ?? null, next ?? null)
}

const getSortedTasks = (columnId: string, tasks: TaskEntity[]) =>
	tasks
		.filter((task) => task.columnId === columnId)
		.sort((a, b) => (a.position < b.position ? -1 : a.position > b.position ? 1 : 0))

export const useTasks = (columnId: string) => {
	const { data } = useSuspenseQuery(tasksQuery)
	return getSortedTasks(columnId, data)
}

export const useUpdateTask = () => {
	const queryClient = useQueryClient()

	const { mutate } = useMutation({
		mutationFn: (task: TaskEntity) => updateTaskFn({ data: task }),
		onMutate: async (task) => {
			await queryClient.cancelQueries({ queryKey: tasksQuery.queryKey })
			const previous = queryClient.getQueryData<TaskEntity[]>(
				tasksQuery.queryKey,
			)
			queryClient.setQueryData<TaskEntity[]>(tasksQuery.queryKey, (old) =>
				upsertItem(old, task),
			)
			return { previous }
		},
		onError: (_err, _task, context) => {
			queryClient.setQueryData(tasksQuery.queryKey, context?.previous)
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: tasksQuery.queryKey })
		},
	})

	return (id: string, recipe: (draft: Draft<TaskEntity>) => void) => {
		const tasks =
			queryClient.getQueryData<TaskEntity[]>(tasksQuery.queryKey) ?? []
		const task = tasks.find((t) => t.id === id)
		if (!task) throw new Error(`Task with id '${id}' not found`)

		mutate(
			produce(task, (draft) => {
				recipe(draft)
				draft.updatedAt = utcNow()
			}),
		)
	}
}

export const useDeleteTask = () => {
	const queryClient = useQueryClient()

	const { mutate } = useMutation({
		mutationFn: (id: string) => deleteTaskFn({ data: { id } }),
		onMutate: async (id) => {
			await queryClient.cancelQueries({ queryKey: tasksQuery.queryKey })
			const previous = queryClient.getQueryData<TaskEntity[]>(
				tasksQuery.queryKey,
			)
			queryClient.setQueryData<TaskEntity[]>(tasksQuery.queryKey, (old) =>
				removeItem(old, id),
			)
			return { previous }
		},
		onError: (_err, _id, context) => {
			queryClient.setQueryData(tasksQuery.queryKey, context?.previous)
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: tasksQuery.queryKey })
		},
	})

	return mutate
}

export const useAddTask = () => {
	const queryClient = useQueryClient()

	const { mutate } = useMutation({
		mutationFn: (task: TaskEntity) => createTaskFn({ data: task }),
		onMutate: (task) => {
			queryClient.setQueryData<TaskEntity[]>(tasksQuery.queryKey, (old) =>
				upsertItem(old, task),
			)
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: tasksQuery.queryKey })
		},
	})

	return (columnId: string, title: string, description?: string) => {
		const timestamp = utcNow()
		const tasks =
			queryClient.getQueryData<TaskEntity[]>(tasksQuery.queryKey) ?? []
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

		mutate(task)
	}
}

type DndTarget = { columnId: string; index: number }

export const useMoveTask = () => {
	const queryClient = useQueryClient()

	const { mutate } = useMutation({
		mutationFn: (tasks: TaskEntity[]) =>
			Promise.all(tasks.map((task) => updateTaskFn({ data: task }))),
		onMutate: async (updatedTasks) => {
			await queryClient.cancelQueries({ queryKey: tasksQuery.queryKey })
			const previous = queryClient.getQueryData<TaskEntity[]>(
				tasksQuery.queryKey,
			)
			queryClient.setQueryData<TaskEntity[]>(tasksQuery.queryKey, (old) =>
				upsertItems(old, updatedTasks),
			)
			return { previous }
		},
		onError: (_err, _tasks, context) => {
			queryClient.setQueryData(tasksQuery.queryKey, context?.previous)
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: tasksQuery.queryKey })
		},
	})

	return (source: DndTarget, destination: DndTarget) => {
		const tasks =
			queryClient.getQueryData<TaskEntity[]>(tasksQuery.queryKey) ?? []

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

		// Single task to persist: the moved task with its new position
		const toPersist: TaskEntity[] = [
			{
				...sourceTask,
				columnId: destination.columnId,
				position: newPosition,
				updatedAt: timestamp,
			},
		]

		mutate(toPersist)
	}
}
