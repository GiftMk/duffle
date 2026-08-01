import { Dialog } from '@base-ui/react'
import { XIcon } from '@phosphor-icons/react'
import { type ReactElement, useState } from 'react'
import { MarkdownEditor } from '@/components/tasks/editor'
import { ICON_SIZE_PX } from '@/lib/constants'
import { splitMarkdown } from '@/lib/utils'

type TaskDialogProps = {
	trigger: ReactElement
	title: string
	onSubmit: (title: string, description?: string) => boolean
}

export const TaskDialog = ({ trigger, title, onSubmit }: TaskDialogProps) => {
	const [markdown, setMarkdown] = useState(`# ${title}`)
	const [open, setOpen] = useState(false)

	const handleSubmit = () => {
		const { title, description } = splitMarkdown(markdown)
		if (!title) return

		onSubmit(title, description)
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.metaKey && e.key === 'Enter') {
			e.preventDefault()
			handleSubmit()
		}
	}

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Trigger render={trigger} />
			<Dialog.Portal>
				<Dialog.Backdrop className='fixed inset-0 bg-surface-950/20' />
				<Dialog.Popup
					onKeyDown={handleKeyDown}
					className='fixed top-1/2 left-1/2 flex h-[90vh] w-[min(92vw,960px)] -translate-x-1/2 -translate-y-1/2 flex-col rounded-md border border-surface-400 bg-surface-100 shadow-2xl shadow-surface-400/50 focus:outline-none'
				>
					<Dialog.Close
						className='absolute top-2 right-2 rounded-full p-1.5 text-surface-800 hover:bg-surface-300'
						render={
							<button type='button'>
								<XIcon size={ICON_SIZE_PX} weight='bold' />
							</button>
						}
					/>
					<div className='min-h-0 flex-1'>
						{open && (
							<MarkdownEditor
								defaultValue={markdown}
								onChange={setMarkdown}
								className='flex h-full w-full justify-center overflow-y-auto px-12 pt-9'
							/>
						)}
					</div>
					<div className='flex shrink-0 justify-end gap-2 border-surface-400 border-t px-6 py-4'>
						<button
							type='button'
							onClick={() => setOpen(false)}
							className='rounded-md px-3 py-2 text-sm text-typography-600 hover:bg-surface-300/50'
						>
							Cancel
						</button>
						<button
							type='button'
							onClick={handleSubmit}
							className='rounded-md bg-typography-950 px-3 py-2 text-sm text-surface-50 hover:opacity-90'
						>
							Create
						</button>
					</div>
				</Dialog.Popup>
			</Dialog.Portal>
		</Dialog.Root>
	)
}
