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
import { TextSelection } from '@milkdown/kit/prose/state'
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react'
import {
	ProsemirrorAdapterProvider,
	useNodeViewFactory,
} from '@prosemirror-adapter/react'
import { headingLevelIndicator } from '../../plugins/heading-level-indicator'
import './editor.css'
import '@milkdown/kit/prose/view/style/prosemirror.css'
import { history } from '@milkdown/kit/plugin/history'
import { indent } from '@milkdown/kit/plugin/indent'
import { trailing } from '@milkdown/kit/plugin/trailing'
import { gfm } from '@milkdown/kit/preset/gfm'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { autoscroll } from '@/plugins/autoscroll'
import { blockquote } from '@/plugins/blockquote'
import { codeBlock } from '@/plugins/code-block'
import { imageBlock } from '@/plugins/image-block'
import { inlineCode } from '@/plugins/inline-code'
import { listItem } from '@/plugins/list-item'

type EditorContentProps = {
	defaultValue: string
	onChange: (markdown: string) => void
}

const EditorContent = ({ defaultValue, onChange }: EditorContentProps) => {
	const nodeViewFactory = useNodeViewFactory()

	const { get, loading } = useEditor((root) => {
		return Editor.make()
			.config((ctx) => {
				ctx.set(rootCtx, root)
				ctx.set(defaultValueCtx, defaultValue)
				ctx.update(listenerCtx, (prev) => {
					prev.markdownUpdated((_, markdown) => {
						onChange(markdown)
					})
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
			.use(imageBlock(nodeViewFactory))
			.use(listener)
			.use(clipboard)
			.use(headingLevelIndicator)
			.use(autoscroll)
			.use(history)
			.use(trailing)
			.use(indent)
	})

	const initRef = useRef(false)

	useEffect(() => {
		if (initRef.current || loading) return

		const editor = get()
		if (!editor) return

		initRef.current = true
		editor.action((ctx) => {
			const view = ctx.get(editorViewCtx)
			const selection = TextSelection.atEnd(view.state.doc)
			view.dispatch(view.state.tr.setSelection(selection))
			view.focus()
		})
	}, [loading, get])

	return <Milkdown />
}

type MarkdownEditorProps = {
	defaultValue: string
	onChange: (markdown: string) => void
	className?: string
}

export const MarkdownEditor = ({
	defaultValue,
	onChange,
	className,
}: MarkdownEditorProps) => {
	const ref = useRef<HTMLDivElement>(null)

	return (
		<div
			ref={ref}
			id='markdown-editor-container'
			className={cn(
				'scrollbar-gutter-stable flex h-full w-full justify-center overflow-y-auto px-12 pt-9',
				className,
			)}
		>
			<div className='h-full w-full max-w-[80ch]'>
				<MilkdownProvider>
					<ProsemirrorAdapterProvider>
						<EditorContent defaultValue={defaultValue} onChange={onChange} />
					</ProsemirrorAdapterProvider>
				</MilkdownProvider>
			</div>
		</div>
	)
}
