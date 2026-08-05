import { eq, useLiveQuery } from '@tanstack/react-db'
import { tasksCollection } from '@/features/kanban/lib/collections'

export const useTasks = (columnId: string) => {
	const { data } = useLiveQuery((q) =>
		q
			.from({ task: tasksCollection })
			.where(({ task }) => eq(task.columnId, columnId))
			.orderBy(({ task }) => task.position, 'asc'),
	)
	return data
}
