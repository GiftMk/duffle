import { Milkdown, MilkdownProvider } from '@milkdown/react'
import type { Note } from '../types/note'
import { useFormattedPaste } from './hooks/use-formatted-paste'
import { useMarkdownEditor } from './hooks/use-markdown-editor'
import './css/base.css'
import './css/headings.css'
import './css/lists.css'

const MarkdownContainer = ({ content }: { content: string }) => {
	const { ref } = useMarkdownEditor(content)
	useFormattedPaste(ref)

	return <Milkdown />
}

export const MarkdownEditor = ({ note }: { note: Note }) => {
	return (
		<div className='h-full w-full max-w-xl'>
			<MilkdownProvider key={note.id}>
				<MarkdownContainer content={note.content} />
			</MilkdownProvider>
		</div>
	)
}
