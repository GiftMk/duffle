import { useEffect, useState } from 'react'
import { type BoardCard, db } from '@/lib/db'

export type UseCards = {
	skip?: boolean
	limit: number
	orderBy?: keyof BoardCard
}

export const useCards = ({
	skip = false,
	limit,
	orderBy = 'createdAt',
}: UseCards) => {
	const [cards, setCards] = useState<BoardCard[]>([])

	useEffect(() => {
		if (skip) {
			return
		}

		let query = db.boardCards.orderBy(orderBy)

		if (limit) {
			query = query.limit(limit)
		}

		query.toArray().then(setCards)
	}, [skip, limit, orderBy])

	return cards
}
