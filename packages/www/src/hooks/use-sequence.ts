import { useEffect, useState } from 'react'

export const useSequence = <T>(items: T[], intervalMs: number) => {
	const [index, setIndex] = useState(0)

	useEffect(() => {
		const intervalId = setInterval(
			() => setIndex((curr) => (curr + 1) % items.length),
			intervalMs,
		)

		return () => clearInterval(intervalId)
	}, [items, intervalMs])

	return items[index]
}
