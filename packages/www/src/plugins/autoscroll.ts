import { Plugin, PluginKey } from '@milkdown/prose/state'
import { $prose } from '@milkdown/utils'
import { EDITOR_SPACER_HEIGHT_PX, ELEMENT_IDS } from '@/lib/constants'

export const autoscroll = $prose(
	() =>
		new Plugin({
			key: new PluginKey('autoscroll'),
			view() {
				return {
					update: (view, prevState) => {
						const selection = view.state.selection
						if (selection.eq(prevState.selection)) {
							return
						}

						const { node } = view.domAtPos(selection.anchor)
						const anchorElement =
							node instanceof Element ? node : node.parentElement
						const container = document.getElementById(
							ELEMENT_IDS.editorContainer,
						)

						if (!anchorElement || !container) {
							return
						}

						const anchorBottom = anchorElement.getBoundingClientRect().bottom

						if (window.innerHeight - anchorBottom < EDITOR_SPACER_HEIGHT_PX) {
							container.scrollBy({
								top: EDITOR_SPACER_HEIGHT_PX,
								behavior: 'instant',
							})
						}
					},
				}
			},
		}),
)
