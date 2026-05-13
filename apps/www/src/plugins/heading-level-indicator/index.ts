import { Plugin, PluginKey } from '@milkdown/prose/state'
import { Decoration, DecorationSet } from '@milkdown/prose/view'
import { $prose } from '@milkdown/utils'

export const headingLevelIndicator = $prose(
	() =>
		new Plugin({
			key: new PluginKey('heading-level-indicator'),
			props: {
				decorations: (state) => {
					const { selection, doc } = state
					const parent = selection.$from.parent

					if (parent.type.name !== 'heading') {
						return null
					}

					const pos = selection.$from.before()
					const level = parent.attrs.level

					return DecorationSet.create(doc, [
						Decoration.node(pos, pos + parent.nodeSize, {
							class: 'heading-active',
							'data-heading-level': `H${level}`,
						}),
					])
				},
			},
		}),
)
