import {
	defaultValueCtx,
	Editor,
	editorViewCtx,
	editorViewOptionsCtx,
	rootCtx,
} from '@milkdown/kit/core'
import { clipboard } from '@milkdown/kit/plugin/clipboard'
import { listener, listenerCtx } from '@milkdown/kit/plugin/listener'
import {
	commonmark,
	inlineCodeInputRule,
} from '@milkdown/kit/preset/commonmark'
import { TextSelection } from '@milkdown/kit/prose/state'
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react'
import {
	ProsemirrorAdapterProvider,
	useNodeViewFactory,
	usePluginViewFactory,
} from '@prosemirror-adapter/react'
import './editor.css'
import '@milkdown/kit/prose/view/style/prosemirror.css'
import { history } from '@milkdown/kit/plugin/history'
import { indent } from '@milkdown/kit/plugin/indent'
import { trailing } from '@milkdown/kit/plugin/trailing'
import { gfm } from '@milkdown/kit/preset/gfm'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { autoscroll } from '@/prosemirror/autoscroll'
import { blockquote } from '@/prosemirror/blockquote'
import { codeBlock } from '@/prosemirror/code-block'
import { codemark } from '@/prosemirror/codemark'
import { headingLevelIndicator } from '@/prosemirror/heading-level-indicator'
import { imageBlock } from '@/prosemirror/image-block'
import { inlineCode } from '@/prosemirror/inline-code'
import { listItem } from '@/prosemirror/list-item'
import { SlashCommands, slash } from '@/prosemirror/slash-commands'

// codemark handles backtick input rules for inline code itself
const commonmarkPreset = commonmark.filter(
	(plugin) => plugin !== inlineCodeInputRule,
)

type EditorContentProps = {
	defaultValue: string
	onChange: (markdown: string) => void
}

const EditorContent = ({ defaultValue, onChange }: EditorContentProps) => {
	const nodeViewFactory = useNodeViewFactory()
	const pluginViewFactory = usePluginViewFactory()

	const { get, loading } = useEditor((root) => {
		return Editor.make()
			.config((ctx) => {
				ctx.set(rootCtx, root)
				ctx.set(defaultValueCtx, defaultValue)
				ctx.set(slash.key, {
					view: pluginViewFactory({
						component: SlashCommands,
					}),
				})
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
			.use(commonmarkPreset)
			.use(gfm)
			.use(codeBlock)
			.use(blockquote(nodeViewFactory))
			.use(inlineCode(nodeViewFactory))
			.use(codemark)
			.use(listItem(nodeViewFactory))
			.use(imageBlock(nodeViewFactory))
			.use(slash)
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
