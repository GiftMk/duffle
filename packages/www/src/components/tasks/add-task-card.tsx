import { CornersOutIcon, PlusIcon } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { ICON_SIZE_PX } from '@/lib/constants'
import { AddTaskInput } from './add-task-input'
import { useBoardContext } from './board-provider'
import { TaskDialog } from './task-dialog'

type AddTaskCardProps = {
	columnId: string
}

export const AddTaskCard = ({ columnId }: AddTaskCardProps) => {
	const { addTask } = useBoardContext()
	const [isEditing, setIsEditing] = useState(false)
	const [title, setTitle] = useState('')
	const inputRef = useRef<HTMLInputElement>(null)
	const dialogTriggerRef = useRef<HTMLButtonElement>(null)

	useEffect(() => {
		if (isEditing) {
			inputRef.current?.focus()
		}
	}, [isEditing])

	const resetInput = () => {
		setIsEditing(false)
		setTitle('')
	}

	const handleSubmit = (title: string, description?: string) => {
		const trimmed = title.trim()
		if (!trimmed) {
			return false
		}

		addTask(columnId, trimmed, description)
		resetInput()
		return true
	}

	const handleInputBlur = (e: React.FocusEvent) => {
		if (e.relatedTarget === dialogTriggerRef.current) {
			return
		}
	}

	return (
		<>
			{!isEditing ? (
				<button
					type='button'
					onClick={() => setIsEditing(true)}
					className='flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-typography-600 transition-colors hover:bg-surface-300/50 hover:text-typography-950'
				>
					<PlusIcon size={ICON_SIZE_PX} />
					Add a card
				</button>
			) : (
				<div className='flex items-center rounded-md border border-surface-400 bg-surface-100'>
					<AddTaskInput
						ref={inputRef}
						onSubmit={handleSubmit}
						onBlur={handleInputBlur}
						onCancel={resetInput}
						value={title}
						onChange={setTitle}
					/>
					<TaskDialog
						trigger={
							<button
								ref={dialogTriggerRef}
								type='button'
								aria-label='Expand to markdown editor'
								className='mr-1 shrink-0 rounded p-1.25 text-typography-600 hover:bg-surface-300/50 hover:text-typography-950'
							>
								<CornersOutIcon size={ICON_SIZE_PX} />
							</button>
						}
						title={title}
						onSubmit={handleSubmit}
					/>
				</div>
			)}
		</>
	)
}
