import { blockquoteSchema } from '@milkdown/kit/preset/commonmark'
import { useNodeViewContext } from '@prosemirror-adapter/react'
import { milkdownReactPlugin, type NodeViewFactory } from './plugin'

const Blockquote = () => {
	const { contentRef } = useNodeViewContext()

	return (
		<div className='relative mb-1.5'>
			<blockquote
				className='pl-4 before:absolute before:inset-0 before:w-1 before:rounded-sm before:bg-primary-500 before:content-[""]'
				ref={contentRef}
			/>
		</div>
	)
}

export const blockquote = (nodeViewFactory: NodeViewFactory) => {
	return milkdownReactPlugin(nodeViewFactory, blockquoteSchema.node, Blockquote)
}
