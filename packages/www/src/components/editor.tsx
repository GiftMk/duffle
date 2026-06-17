import type { Document } from '@duffle/api'
import {
	defaultValueCtx,
	Editor,
	editorViewOptionsCtx,
	rootCtx,
} from '@milkdown/kit/core'
import { clipboard } from '@milkdown/kit/plugin/clipboard'
import { listener, listenerCtx } from '@milkdown/kit/plugin/listener'
import { commonmark } from '@milkdown/kit/preset/commonmark'
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react'
import {
	ProsemirrorAdapterProvider,
	useNodeViewFactory,
} from '@prosemirror-adapter/react'
import { codeBlock } from '../plugins/code-block'
import { headingLevelIndicator } from '../plugins/heading-level-indicator'
import './editor.css'
import '@milkdown/kit/prose/view/style/prosemirror.css'
import { gfm } from '@milkdown/kit/preset/gfm'
import { useHotkey } from '@tanstack/react-hotkeys'
import { documentCollection } from '@/lib/collections'
import { blockquote } from '@/plugins/blockquote'
import { inlineCode } from '@/plugins/inline-code'
import { listItem } from '@/plugins/list-item'

const EditorContent = ({ document }: { document: Document }) => {
	const nodeViewFactory = useNodeViewFactory()

	const { get } = useEditor((root) => {
		return Editor.make()
			.config((ctx) => {
				ctx.set(rootCtx, root)
				ctx.set(defaultValueCtx, document.markdown)
				ctx.update(editorViewOptionsCtx, (prev) => ({
					...prev,
					attributes: { autofocus: 'true' },
				}))
			})
			.use(codeBlock)
			.use(blockquote(nodeViewFactory))
			.use(inlineCode(nodeViewFactory))
			.use(listItem(nodeViewFactory))
			.use(listener)
			.use(commonmark)
			.use(gfm)
			.use(clipboard)
			.use(headingLevelIndicator)
	})

	useHotkey('Mod+S', () => {
		const editor = get()

		if (!editor) {
			return
		}

		const listenerManager = editor.ctx.get(listenerCtx)
		listenerManager.markdownUpdated((_, markdown) =>
			documentCollection.update(document.id, (draft) => {
				draft.markdown = markdown
			}),
		)

		alert('Updated document!')
	})

	return <Milkdown />
}

export const MarkdownEditor = ({ document }: { document: Document }) => {
	return (
		<div className='flex h-full w-full justify-center overflow-y-auto p-12'>
			<div className='h-fit min-h-full w-full max-w-[70ch]'>
				<MilkdownProvider>
					<ProsemirrorAdapterProvider>
						<EditorContent document={document} />
					</ProsemirrorAdapterProvider>
				</MilkdownProvider>
			</div>
		</div>
	)
}
