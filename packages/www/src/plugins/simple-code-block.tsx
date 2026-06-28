import { codeBlockSchema } from '@milkdown/kit/preset/commonmark'
import { $view } from '@milkdown/utils'
import { useNodeViewContext } from '@prosemirror-adapter/react'
import { cn } from '@/lib/utils'
import type { NodeViewFactory } from './types'

const CodeBlock = () => {
	const { contentRef, node } = useNodeViewContext()
	const language = node.attrs.language || 'typescript'

	return (
		<pre
			className={cn(
				'w-full rounded-md bg-surface-300 p-4 font-mono',
				`language-${language}`,
			)}
		>
			<code className='shiki' ref={contentRef} />
		</pre>
	)
}

export const simpleCodeBlock = (nodeViewFactory: NodeViewFactory) => {
	return $view(codeBlockSchema.node, () =>
		nodeViewFactory({
			component: CodeBlock,
		}),
	)
}
