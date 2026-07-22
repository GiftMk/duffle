import type { EditorState } from '@milkdown/prose/state'
import { Plugin, PluginKey } from '@milkdown/prose/state'
import { $prose } from '@milkdown/utils'

const getTodoItemPosition = (state: EditorState) => {
	if (!state.selection.empty) {
		return null
	}

	const { $from } = state.selection

	for (let depth = $from.depth; depth > 0; depth -= 1) {
		const node = $from.node(depth)

		if (node.type.name === 'list_item' && node.attrs.checked !== null) {
			return $from.before(depth)
		}
	}

	return null
}

export const todoShiftEnter = $prose(
	() =>
		new Plugin({
			key: new PluginKey('todo-shift-enter'),
			props: {
				handleKeyDown: (view, event) => {
					if (event.key !== 'Enter' || !event.shiftKey) {
						return false
					}

					const todoItemPosition = getTodoItemPosition(view.state)

					if (todoItemPosition === null) {
						return false
					}

					const checked = view.state.doc.nodeAt(todoItemPosition)?.attrs.checked
					view.dispatch(
						view.state.tr.setNodeAttribute(
							todoItemPosition,
							'checked',
							!checked,
						),
					)
					return true
				},
			},
		}),
)
