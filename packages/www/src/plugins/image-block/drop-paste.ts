import type { Ctx } from '@milkdown/kit/ctx'
import type { Node } from '@milkdown/prose/model'
import { Plugin } from '@milkdown/prose/state'
import type { EditorView } from '@milkdown/prose/view'
import { $prose } from '@milkdown/utils'
import { imageBlockConfig } from './config'
import { imageBlockSchema } from './schema'

const findImageFile = (files: FileList | null | undefined) =>
	[...(files ?? [])].find((file) => file.type.startsWith('image/'))

// Snaps to the nearest block edge so a drop/paste never splits text.
const nearestBlockBoundary = (doc: Node, pos: number) => {
	const $pos = doc.resolve(pos)
	if ($pos.depth === 0) {
		return pos
	}

	const before = $pos.before($pos.depth)
	const after = $pos.after($pos.depth)

	return pos - before <= after - pos ? before : after
}

const insertImageBlock = (
	view: EditorView,
	ctx: Ctx,
	file: File,
	pos?: number,
) => {
	const { onUpload } = ctx.get(imageBlockConfig.key)

	onUpload(file)
		.then((src: string) => {
			const node = imageBlockSchema.type(ctx).create({ src, caption: '' })
			const rawPos = pos ?? view.state.selection.from
			const insertPos = nearestBlockBoundary(view.state.doc, rawPos)

			// block-group atom, so replaceRangeWith finds a valid insertion point.
			view.dispatch(view.state.tr.replaceRangeWith(insertPos, insertPos, node))
		})
		.catch(console.error)
}

// Must run before the built-in clipboard plugin so image files get first refusal.
export const imageBlockDropPaste = $prose(
	(ctx) =>
		new Plugin({
			props: {
				handleDrop: (view, event) => {
					const file = findImageFile(event.dataTransfer?.files)
					if (!file) {
						return false
					}

					const pos = view.posAtCoords({
						left: event.clientX,
						top: event.clientY,
					})?.pos

					insertImageBlock(view, ctx, file, pos)
					return true
				},
				handlePaste: (view, event) => {
					const file = findImageFile(event.clipboardData?.files)
					if (!file) {
						return false
					}

					insertImageBlock(view, ctx, file)
					return true
				},
			},
		}),
)
