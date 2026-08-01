import { useEffect, useState } from 'react'
import { type TaskEntity, db } from '@/lib/db'

export type UseTasksProps = {
	skip?: boolean
	limit: number
	orderBy?: keyof TaskEntity
}

export const useTasks = ({
	skip = false,
	limit,
	orderBy = 'createdAt',
}: UseTasksProps) => {
	const [cards, setCards] = useState<TaskEntity[]>([])

	useEffect(() => {
		if (skip) {
			return
		}

		let query = db.tasks.orderBy(orderBy)

		if (limit) {
			query = query.limit(limit)
		}

		query.toArray().then(setCards)
	}, [skip, limit, orderBy])

	return cards
}
