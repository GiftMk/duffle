import { Milkdown, MilkdownProvider } from '@milkdown/react'
import { useMarkdownEditor } from './hooks/use-markdown-editor'
import type { Document } from './types/document'
import './css/base.css'
import './css/headings.css'
import './css/lists.css'
import { useMutation } from '@tanstack/react-query'
import { updateDocument } from './lib/api'
import { formatOnPaste } from './lib/utils'

const MarkdownContainer = ({ document }: { document: Document }) => {
	const mutation = useMutation({
		mutationFn: (markdown: string) => {
			console.log(markdown)
			return updateDocument(document.id, markdown)
		},
	})

	useMarkdownEditor(document.markdown, {
		onPaste: formatOnPaste,
		onUpdate: mutation.mutate,
	})

	return <Milkdown />
}

export const MarkdownEditor = ({ document }: { document: Document }) => {
	return (
		<div className='h-full w-full max-w-xl'>
			<MilkdownProvider key={document.id}>
				<MarkdownContainer document={document} />
			</MilkdownProvider>
		</div>
	)
}
