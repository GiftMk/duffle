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
import { headingLevelIndicator } from '../plugins/heading-level-indicator'
import './editor.css'
import '@milkdown/kit/prose/view/style/prosemirror.css'
import { history } from '@milkdown/kit/plugin/history'
import { indent } from '@milkdown/kit/plugin/indent'
import { trailing } from '@milkdown/kit/plugin/trailing'
import { gfm } from '@milkdown/kit/preset/gfm'
import { useRef } from 'react'
import { useSequence } from '@/hooks/use-sequence'
import { updateNote } from '@/lib/actions'
import type { Note } from '@/lib/db'
import { autoscroll } from '@/plugins/autoscroll'
import { blockquote } from '@/plugins/blockquote'
import { codeBlock } from '@/plugins/code-block'
import { inlineCode } from '@/plugins/inline-code'
import { listItem } from '@/plugins/list-item'
import { Kanmoji } from './kanmoji'

const EditorContent = ({ note }: { note: Note }) => {
	const nodeViewFactory = useNodeViewFactory()

	useEditor((root) => {
		return Editor.make()
			.config((ctx) => {
				ctx.set(rootCtx, root)
				ctx.set(defaultValueCtx, note.markdown)
				ctx.update(listenerCtx, (prev) => {
					prev.markdownUpdated((_, markdown) => updateNote(note.id, markdown))
					return prev
				})
				ctx.update(editorViewOptionsCtx, (prev) => ({
					...prev,
					attributes: { autofocus: 'true' },
				}))
			})
			.use(commonmark)
			.use(gfm)
			.use(codeBlock)
			.use(blockquote(nodeViewFactory))
			.use(inlineCode(nodeViewFactory))
			.use(listItem(nodeViewFactory))
			.use(listener)
			.use(clipboard)
			.use(headingLevelIndicator)
			.use(autoscroll)
			.use(history)
			.use(trailing)
			.use(indent)
	})

	return <Milkdown />
}

export const MarkdownEditor = ({ note }: { note: Note }) => {
	const ref = useRef<HTMLDivElement>(null)
	const face = useSequence(
		['<(o_o<)', `(˶ᵔ ᵕ ᵔ˶)`, `( ˶°ㅁ°) !!`, 'ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧', '٩(ˊᗜˋ*)و ♡'],
		7_000,
	)

	return (
		<div
			ref={ref}
			key={note.id}
			id='markdown-editor-container'
			className='flex h-full w-full justify-center overflow-y-auto px-12 pt-9'
		>
			<Kanmoji className='absolute right-4 bottom-4 text-surface-500'>
				{face}
			</Kanmoji>
			<div className='h-full w-full max-w-[70ch]'>
				<MilkdownProvider>
					<ProsemirrorAdapterProvider>
						<EditorContent note={note} />
					</ProsemirrorAdapterProvider>
				</MilkdownProvider>
			</div>
		</div>
	)
}
