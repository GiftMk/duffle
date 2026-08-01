import { useSelector } from '@xstate/store-react'
import { tasksStore } from '@/state/tasks-store'

export const useTaskOrThrow = (id: string) => {
	const task = useSelector(tasksStore, (store) => store.context.tasks[id])

	if (!task) {
		throw new Error(`Task with id '${id}' not found`)
	}

	return task
}

export const useTasks = () => {
	const tasks = useSelector(tasksStore, (store) => store.context.tasks)
	return Object.values(tasks)
}
