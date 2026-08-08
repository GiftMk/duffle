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
	createTask as createTaskFn,
	deleteTask as deleteTaskFn,
	getTasks,
	updateTask as updateTaskFn,
} from '@/server/tasks'

export const tasksQuery = queryOptions({
	queryKey: ['tasks'],
	queryFn: async () => taskSchema.array().parse(await getTasks()),
	staleTime: Infinity,
})

const getSortedTasks = (columnId: string, tasks: TaskEntity[]) =>
	tasks
		.filter((task) => task.columnId === columnId)
		.sort((a, b) => a.position - b.position)

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
		const position = lastTask === undefined ? 0 : lastTask.position + 1

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

type DndTarget = Pick<TaskEntity, 'position' | 'columnId'>

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
		const sourceTasks = getSortedTasks(source.columnId, tasks)
		const sourceTask = sourceTasks[source.position]

		if (!sourceTask) {
			throw new Error('Failed to move task, could not find source task.')
		}

		const timestamp = utcNow()
		const toPersist: TaskEntity[] = []

		const reposition = (columnId: string, list: TaskEntity[]) => {
			for (const [i, task] of list.entries()) {
				toPersist.push({ ...task, columnId, position: i, updatedAt: timestamp })
			}
		}

		if (source.columnId === destination.columnId) {
			sourceTasks.splice(source.position, 1)
			sourceTasks.splice(destination.position, 0, sourceTask)
			reposition(source.columnId, sourceTasks)
		} else {
			sourceTasks.splice(source.position, 1)
			reposition(source.columnId, sourceTasks)

			const destinationTasks = getSortedTasks(destination.columnId, tasks)
			destinationTasks.splice(destination.position, 0, sourceTask)
			reposition(destination.columnId, destinationTasks)
		}

		mutate(toPersist)
	}
}
