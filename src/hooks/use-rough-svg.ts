import { type RefObject, useEffect } from 'react'
import rough from 'roughjs'
import type { Options } from 'roughjs/bin/core'
import { useDimensions } from './use-dimensions'

type TypedOptions = Options & {
	fillStyle:
		| 'hachure'
		| 'solid'
		| 'zigzag'
		| 'cross-hatch'
		| 'dots'
		| 'dashed'
		| 'zigzag-line'
}

/**
 * Renders a `roughjs` rectangle inside the svg element.
 *
 * For this to work, the parent's height & width shouldn't depend on the svg.
 * A typical usecase is a relative parent with an absolute svg i.e.
 *
 * ```js
 * <div className='relative'>
 *  <svg className='absolute inset-0' />
 * </div>
 * ```
 */
export const useRoughSvg = (
	parentRef: RefObject<HTMLElement | null>,
	svgRef: RefObject<SVGSVGElement | null>,
	options?: TypedOptions,
) => {
	const parentDimensions = useDimensions(parentRef)

	useEffect(() => {
		const svg = svgRef.current

		if (!svg) {
			return
		}

		const rc = rough.svg(svg)
		const { width, height } = parentDimensions

		const node = rc.rectangle(0, 0, width, height, options)
		svg.appendChild(node)

		return () => {
			svg.removeChild(node)
		}
	}, [parentDimensions, options, svgRef.current])
}
