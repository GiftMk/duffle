import { Dialog } from '@base-ui/react'
import { XIcon } from '@phosphor-icons/react'
import { useEffect, useRef } from 'react'
import { MarkdownEditor } from '@/components/editor'
import { parseCardContent } from '@/lib/card-content'
import { ICON_SIZE_PX } from '@/lib/constants'

type CardEditorDialogProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	initialTitle: string
	onCreate: (title: string, description?: string) => void
}

export const CardEditorDialog = ({
	open,
	onOpenChange,
	initialTitle,
	onCreate,
}: CardEditorDialogProps) => {
	// Tracks the editor's live markdown for submit. This component stays
	// mounted across opens (only Dialog.Popup's contents toggle), so re-seed
	// it fresh from initialTitle every time the dialog opens.
	const markdownRef = useRef(`# ${initialTitle}`)

	useEffect(() => {
		if (open) {
			markdownRef.current = `# ${initialTitle}`
		}
	}, [open, initialTitle])

	const handleCreate = () => {
		const { title, description } = parseCardContent(markdownRef.current)
		if (!title) return

		onCreate(title, description || undefined)
		onOpenChange(false)
	}

	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Portal>
				<Dialog.Backdrop className='fixed inset-0 bg-surface-950/20' />
				<Dialog.Popup
					onKeyDown={(e) => {
						if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
							e.preventDefault()
							handleCreate()
						}
					}}
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
								defaultValue={`# ${initialTitle}`}
								onChange={(markdown) => {
									markdownRef.current = markdown
								}}
								className='flex h-full w-full justify-center overflow-y-auto px-12 pt-9'
							/>
						)}
					</div>
					<div className='flex shrink-0 justify-end gap-2 border-surface-400 border-t px-6 py-4'>
						<button
							type='button'
							onClick={() => onOpenChange(false)}
							className='rounded-md px-3 py-2 text-sm text-typography-600 hover:bg-surface-300/50'
						>
							Cancel
						</button>
						<button
							type='button'
							onClick={handleCreate}
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
