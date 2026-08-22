import { type RefObject, useEffect, useState } from 'react'

type Dimensions = {
	width: number
	height: number
}

export const useDimensions = (ref: RefObject<Element | null>): Dimensions => {
	const [dimensions, setDimensions] = useState<Dimensions>({
		width: 0,
		height: 0,
	})

	useEffect(() => {
		const element = ref.current

		if (!element) return

		const resizeObserver = new ResizeObserver((_entries) => {
			const clientRect = element.getBoundingClientRect()
			setDimensions(clientRect)
		})

		resizeObserver.observe(element)

		return () => resizeObserver.disconnect()
	}, [ref])

	return dimensions
}
