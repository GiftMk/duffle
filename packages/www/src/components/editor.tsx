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
import { useEffect, useState } from 'react'
import { updateNote } from '@/lib/actions'
import type { Note } from '@/lib/db'
import { blockquote } from '@/plugins/blockquote'
import { codeBlock } from '@/plugins/code-block'
import { inlineCode } from '@/plugins/inline-code'
import { listItem } from '@/plugins/list-item'
import { Kanmoji } from './kanmoji'
import { usePluginViewFactory } from '@prosemirror-adapter/react'
import { slash, SlashCommands } from '@/plugins/slash-commands'

const EditorContent = ({ note }: { note: Note }) => {
	const nodeViewFactory = useNodeViewFactory()
	const pluginViewFactory = usePluginViewFactory()

	const { get } = useEditor((root) => {
		return Editor.make()
			.config((ctx) => {
				ctx.set(rootCtx, root)
				ctx.set(defaultValueCtx, note.markdown)
				ctx.set(slash.key, {
					view: pluginViewFactory({
						component: SlashCommands,
					}),
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
			.use(slash)
			.use(listener)
			.use(clipboard)
			.use(headingLevelIndicator)
			.use(history)
			.use(trailing)
			.use(indent)
	})

	useEffect(() => {
		const editor = get()

		if (!editor) {
			return
		}

		const listenerManager = editor.ctx.get(listenerCtx)
		listenerManager.markdownUpdated((_, markdown) =>
			updateNote(note.id, markdown),
		)
	}, [get, note.id])

	return <Milkdown />
}

const faces = [
	'<(o_o<)',
	`(˶ᵔ ᵕ ᵔ˶)`,
	`( ˶°ㅁ°) !!`,
	'ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧',
	'٩(ˊᗜˋ*)و ♡',
]

export const MarkdownEditor = ({ note }: { note: Note }) => {
	const [faceIndex, setFaceIndex] = useState(0)
	const face = faces[faceIndex]

	useEffect(() => {
		const intervalId = setInterval(
			() => setFaceIndex((curr) => (curr + 1) % faces.length),
			10_000,
		)

		return () => clearInterval(intervalId)
	}, [])

	return (
		<div
			key={note.id}
			className='relative flex h-full w-full justify-center overflow-y-auto px-12 pt-9'
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
