import { $view } from '@milkdown/utils'
import type { NodeViewFactory } from '../types'
import { createImageBlock } from './components/image-block'
import { imageBlockConfig } from './config'
import { imageBlockDropPaste } from './drop-paste'
import { imageBlockInputRule } from './input-rule'
import { remarkImageBlockPlugin } from './remark-plugin'
import { imageBlockSchema } from './schema'

export * from './config'
export * from './schema'

export const imageBlock = (nodeViewFactory: NodeViewFactory) => {
	const imageBlockView = $view(imageBlockSchema.node, (ctx) => {
		const config = ctx.get(imageBlockConfig.key)

		return nodeViewFactory({
			component: createImageBlock(config),
			// Without this, typing in the caption/link inputs is treated as
			// typing over the node's selection and deletes it.
			stopEvent: (event) => event.target instanceof HTMLInputElement,
		})
	})

	return [
		remarkImageBlockPlugin,
		imageBlockSchema,
		imageBlockConfig,
		imageBlockInputRule,
		imageBlockDropPaste,
		imageBlockView,
	].flat()
}
