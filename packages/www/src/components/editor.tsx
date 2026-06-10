import type { Document } from '@duffle/api'
import {
  defaultValueCtx,
  Editor,
  editorViewOptionsCtx,
  rootCtx,
} from '@milkdown/kit/core'
import { clipboard } from '@milkdown/kit/plugin/clipboard'
import { listener } from '@milkdown/kit/plugin/listener'
import { commonmark } from '@milkdown/kit/preset/commonmark'
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react'
import {
  ProsemirrorAdapterProvider,
  useNodeViewFactory,
} from '@prosemirror-adapter/react'
import { useAutoSave } from '../hooks/use-auto-save'
import { codeBlock } from '../plugins/code-block'
import { headingLevelIndicator } from '../plugins/heading-level-indicator'
import './editor.css'
import { blockquote } from '@/plugins/blockquote'
import { inlineCode } from '@/plugins/inline-code'

const EditorContent = ({ document }: { document: Document }) => {
  const nodeViewFactory = useNodeViewFactory()

  useEditor((root) => {
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
      .use(listener)
      .use(commonmark)
      .use(clipboard)
      .use(headingLevelIndicator)
  })
  useAutoSave(document.id)

  return <Milkdown />
}

export const MarkdownEditor = ({ document }: { document: Document }) => {
  return (
    <div className='h-full w-full overflow-y-auto max-w-[75ch] py-12'>
      <MilkdownProvider>
        <ProsemirrorAdapterProvider>
          <EditorContent document={document} />
        </ProsemirrorAdapterProvider>
      </MilkdownProvider>
    </div>
  )
}
