import {
	defaultValueCtx,
	Editor,
	editorViewOptionsCtx,
	rootCtx,
} from '@milkdown/kit/core'
import { commonmark } from '@milkdown/kit/preset/commonmark'
import { useEditor } from '@milkdown/react'

export const useMarkdownEditor = (content: string) => {
	const { get } = useEditor((root) =>
		Editor.make()
			.config((ctx) => {
				ctx.set(rootCtx, root)
				ctx.set(defaultValueCtx, content)
				ctx.update(editorViewOptionsCtx, (prev) => ({
					...prev,
					attributes: { autofocus: 'true' },
				}))
			})
			.use(commonmark),
	)

	return { ref: get }
}
