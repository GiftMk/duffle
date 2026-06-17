import { blockquoteSchema } from '@milkdown/kit/preset/commonmark'
import { $view } from '@milkdown/utils'
import { useNodeViewContext } from '@prosemirror-adapter/react'
import type { NodeViewFactory } from './types'

const Blockquote = () => {
	const { contentRef } = useNodeViewContext()

	return (
		<div className='relative my-1.5'>
			<blockquote
				className='pl-4 before:absolute before:inset-0 before:w-1 before:rounded-sm before:bg-primary-500 before:content-[""] text-typography-600'
				ref={contentRef}
			/>
		</div>
	)
}

export const blockquote = (nodeViewFactory: NodeViewFactory) => {
	return $view(blockquoteSchema.node, () =>
		nodeViewFactory({
			component: Blockquote,
		}),
	)
}
