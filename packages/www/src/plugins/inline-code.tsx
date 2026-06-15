import { inlineCodeSchema } from '@milkdown/kit/preset/commonmark'
import { $view } from '@milkdown/utils'
import { useNodeViewContext } from '@prosemirror-adapter/react'
import type { NodeViewFactory } from './types'

const InlineCode = () => {
  const { contentRef } = useNodeViewContext()

  return (
    <span
      className='rounded-md bg-surface-300 px-1.5 py-1.25 font-mono text-primary-600'
      ref={contentRef}
    />
  )
}

export const inlineCode = (nodeViewFactory: NodeViewFactory) => {
  return $view(inlineCodeSchema.mark, () =>
    nodeViewFactory({
      component: InlineCode,
      as: 'span',
      contentAs: 'code',
    }),
  )
}
