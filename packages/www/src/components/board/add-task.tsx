import { CornersOutIcon, PlusIcon } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { ICON_SIZE_PX } from '@/lib/constants'
import { useBoardContext } from './board-provider'
import { EditTaskDialog } from './edit-task-dialog'

type AddTaskProps = {
	columnId: string
}

export const AddTask = ({ columnId }: AddTaskProps) => {
	const { addTask } = useBoardContext()
	const [isEditing, setIsEditing] = useState(false)
	const [title, setTitle] = useState('')
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [dialogInitialTitle, setDialogInitialTitle] = useState('')
	const cancelledRef = useRef(false)
	const inputRef = useRef<HTMLInputElement>(null)
	const expandButtonRef = useRef<HTMLButtonElement>(null)

	useEffect(() => {
		if (isEditing) {
			inputRef.current?.focus()
		}
	}, [isEditing])

	const closeAndReset = () => {
		setIsEditing(false)
		setTitle('')
	}

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		// Focus landing on the expand button means it's about to open the
		// dialog - its onClick handles everything, so don't commit here.
		if (e.relatedTarget === expandButtonRef.current) return

		if (cancelledRef.current) {
			cancelledRef.current = false
			closeAndReset()
			return
		}

		const trimmed = title.trim()
		if (trimmed) {
			addTask(columnId, trimmed)
		}
		closeAndReset()
	}

	const openDialog = () => {
		setDialogInitialTitle(title)
		setIsDialogOpen(true)
		closeAndReset()
	}

	return (
		<>
			{!isEditing ? (
				<button
					type='button'
					onClick={() => setIsEditing(true)}
					className='flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-typography-600 transition-colors hover:bg-surface-300/50 hover:text-typography-950'
				>
					<PlusIcon size={ICON_SIZE_PX} weight='bold' />
					Add a card
				</button>
			) : (
				<div className='flex items-center rounded-md border border-surface-400 bg-surface-100 pr-1'>
					<input
						ref={inputRef}
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						onBlur={handleBlur}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								e.currentTarget.blur()
							}
							if (e.key === 'Escape') {
								cancelledRef.current = true
								e.currentTarget.blur()
							}
						}}
						placeholder='Card title'
						className='w-full border-0 bg-transparent px-3 py-2 text-sm text-typography-950 focus:outline-none'
					/>
					<button
						ref={expandButtonRef}
						type='button'
						aria-label='Expand to markdown editor'
						onClick={openDialog}
						className='shrink-0 rounded p-1 text-typography-600 hover:bg-surface-300/50 hover:text-typography-950'
					>
						<CornersOutIcon size={ICON_SIZE_PX} />
					</button>
				</div>
			)}
			<EditTaskDialog
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}
				initialTitle={dialogInitialTitle}
				onCreate={(cardTitle, description) => {
					addTask(columnId, cardTitle, description)
				}}
			/>
		</>
	)
}
