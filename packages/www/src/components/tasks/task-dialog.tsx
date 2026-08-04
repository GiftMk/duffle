import { Dialog } from '@base-ui/react'
import { XIcon } from '@phosphor-icons/react'
import { type ReactElement, useEffect, useState } from 'react'
import { MarkdownEditor } from '@/components/tasks/editor'
import { ICON_SIZE_MD } from '@/lib/constants'
import { splitMarkdown } from '@/lib/utils'
import { IconButton } from '../icon-button'

const getMarkdown = (title: string, description?: string) => {
	if (!description) {
		return `# ${title}`
	}

	return `# ${title}\n${description}`
}

type TaskDialogProps = {
	trigger: ReactElement
	title: string
	description?: string
	onSubmit: (title: string, description?: string) => void
	onCancel?: () => void
	submitLabel: string
	disabled?: boolean
	open?: boolean
	onOpenChange?: (open: boolean) => void
}

export const TaskDialog = ({
	trigger,
	title,
	description,
	onSubmit,
	onCancel,
	submitLabel,
	disabled,
	open: openProp,
	onOpenChange: onOpenChangeProp,
}: TaskDialogProps) => {
	const [markdown, setMarkdown] = useState('')
	const [internalOpen, setInternalOpen] = useState(false)
	const open = openProp ?? internalOpen
	const setOpen = onOpenChangeProp ?? setInternalOpen

	useEffect(() => {
		setMarkdown(getMarkdown(title, description))
	}, [title, description])

	const handleSubmit = () => {
		const { title, description } = splitMarkdown(markdown)
		if (!title) return

		onSubmit(title, description)
		setOpen(false)
	}

	const handleCancel = () => {
		onCancel?.()
		setOpen(false)
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.metaKey && e.key === 'Enter') {
			e.preventDefault()
			handleSubmit()
		}
	}

	const handleOpenChange = (open: boolean) => {
		if (open && disabled) return

		if (!open) {
			handleCancel()
		} else {
			setOpen(true)
		}
	}

	return (
		<Dialog.Root open={open} onOpenChange={handleOpenChange}>
			<Dialog.Trigger render={trigger} />
			<Dialog.Portal>
				<Dialog.Backdrop className='fixed inset-0 bg-surface-950/20' />
				<Dialog.Popup
					onKeyDown={handleKeyDown}
					className='fixed top-1/2 left-1/2 flex h-2/3 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-md border border-surface-400 bg-surface-100 shadow-2xl shadow-surface-400/50 focus:outline-none'
				>
					<Dialog.Close
						render={
							<IconButton className='absolute top-4 right-4'>
								<XIcon size={ICON_SIZE_MD} />
							</IconButton>
						}
						onClick={handleCancel}
					/>
					<div className='min-h-0 flex-1'>
						{open && (
							<MarkdownEditor defaultValue={markdown} onChange={setMarkdown} />
						)}
					</div>
					<div className='flex shrink-0 justify-end gap-2 px-6 py-4'>
						<button
							type='button'
							onClick={handleCancel}
							className='rounded-md px-3 py-2 text-sm text-typography-600 hover:bg-surface-300/50'
						>
							Cancel
						</button>
						<button
							type='button'
							onClick={handleSubmit}
							className='rounded-md bg-primary-600 px-3 py-2 text-sm text-surface-50 hover:bg-primary-700 dark:text-typography-900'
						>
							{submitLabel}
						</button>
					</div>
				</Dialog.Popup>
			</Dialog.Portal>
		</Dialog.Root>
	)
}
