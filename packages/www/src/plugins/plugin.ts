import type { NodeViewConstructor } from '@milkdown/prose/view'
import { type $Node, $view } from '@milkdown/utils'
import type { ReactNodeViewUserOptions } from '@prosemirror-adapter/react'
import type { FC } from 'react'

export type NodeViewFactory = (
	options: ReactNodeViewUserOptions,
) => NodeViewConstructor

export const milkdownReactPlugin = (
	nodeViewFactory: NodeViewFactory,
	node: $Node,
	component: FC,
) => {
	return $view(node, () =>
		nodeViewFactory({
			component,
		}),
	)
}
