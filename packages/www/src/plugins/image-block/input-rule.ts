import { InputRule } from '@milkdown/prose/inputrules'
import { $inputRule } from '@milkdown/utils'
import { imageBlockSchema } from './schema'

// Fires on just "![" (not the full syntax) so it wins before commonmark's
// own image input rule can match the completed text.
export const imageBlockInputRule = $inputRule(
	(ctx) =>
		new InputRule(/^!\[$/, (state, _match, start, end) => {
			const node = imageBlockSchema.type(ctx).create({ src: '', caption: '' })

			// replaceRangeWith expands to a valid block position since
			// image-block can't sit inline in a paragraph.
			return state.tr.replaceRangeWith(start, end, node)
		}),
)
