import {
	defaultValueCtx,
	Editor,
	editorViewCtx,
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
import { useEffect } from 'react'
import { updateNote } from '@/lib/actions'
import type { Note } from '@/lib/db'
import { blockquote } from '@/plugins/blockquote'
import { inlineCode } from '@/plugins/inline-code'
import { listItem } from '@/plugins/list-item'
import { history } from '@milkdown/kit/plugin/history'

const EditorContent = ({ note }: { note: Note }) => {
	const nodeViewFactory = useNodeViewFactory()

	const { get } = useEditor((root) => {
		return Editor.make()
			.config((ctx) => {
				ctx.set(rootCtx, root)
				ctx.set(defaultValueCtx, note.markdown)
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
			.use(history)
	})

	useEffect(() => {
		const editor = get()

		if (!editor) {
			return
		}

		editor.action((ctx) => {
			const view = ctx.get(editorViewCtx)
			view.focus()
		})

		const listenerManager = editor.ctx.get(listenerCtx)
		listenerManager.markdownUpdated((_, markdown) =>
			updateNote(note.id, markdown),
		)
	}, [get, note.id])

	return <Milkdown />
}

export const MarkdownEditor = ({ note }: { note: Note }) => {
	return (
		<div
			key={note.id}
			className='flex h-full w-full justify-center overflow-y-auto px-12 py-9'
		>
			<div className='h-fit min-h-full w-full max-w-[70ch]'>
				<MilkdownProvider>
					<ProsemirrorAdapterProvider>
						<EditorContent note={note} />
					</ProsemirrorAdapterProvider>
				</MilkdownProvider>
			</div>
		</div>
	)
}
