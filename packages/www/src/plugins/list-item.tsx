import { useNodeViewContext } from '@prosemirror-adapter/react'
import type { NodeViewFactory } from './types'
import { listItemSchema } from '@milkdown/kit/preset/commonmark'
import { $view } from '@milkdown/utils'
import { useId } from 'react'
import { cn } from '@/lib/utils'

const ListItem = () => {
	const { contentRef, node, view, getPos } = useNodeViewContext()
	const id = useId()
	const checked: boolean | null = node.attrs.checked
	const listType: 'bullet' | 'ordered' = node.attrs.listType

	const toggleCheckbox = () => {
		if (!view.editable) {
			return
		}

		const pos = getPos()
		if (!pos) {
			return
		}

		view.dispatch(view.state.tr.setNodeAttribute(pos, 'checked', !checked))
	}

	if (checked === null) {
		return (
			<li
				className={cn('mt-2 marker:text-typography-950', {
					'ml-4': listType === 'bullet',
					'ml-6': listType === 'ordered',
				})}
				ref={contentRef}
			/>
		)
	}

	return (
		<li className='list-none mt-2 marker:text-typography-950 flex items-start gap-2.5'>
			<input
				defaultChecked={checked}
				onClick={toggleCheckbox}
				type='checkbox'
				id={id}
				className='accent-primary-500 h-4 w-4 mt-1.5'
			/>
			<span ref={contentRef} />
		</li>
	)
}

export const listItem = (nodeViewFactory: NodeViewFactory) => {
	return $view(listItemSchema.node, () =>
		nodeViewFactory({
			component: ListItem,
		}),
	)
}
