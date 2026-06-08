import type { NodeViewConstructor } from '@milkdown/prose/view'
import { type $Mark, type $Node, $view } from '@milkdown/utils'
import type { ReactNodeViewUserOptions } from '@prosemirror-adapter/react'
import type { FC } from 'react'

export type NodeViewFactory = (
	options: ReactNodeViewUserOptions,
) => NodeViewConstructor

export const milkdownReactPlugin = (
	nodeViewFactory: NodeViewFactory,
	type: $Node | $Mark,
	component: FC,
) => {
	return $view(type, () =>
		nodeViewFactory({
			component,
		}),
	)
}
