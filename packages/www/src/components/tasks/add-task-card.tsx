import { ArrowsOutIcon, PlusIcon } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { addTask } from '@/lib/actions'
import { ICON_SIZE_PX } from '@/lib/constants'
import { AddTaskInput } from './add-task-input'
import { TaskDialog } from './task-dialog'
import { IconButton } from '../icon-button'

type AddTaskCardProps = {
	columnId: string
}

export const AddTaskCard = ({ columnId }: AddTaskCardProps) => {
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
		const trimmedTitle = title.trim()
		if (!trimmedTitle) {
			return false
		}

		addTask(columnId, trimmedTitle, description)
		resetInput()
		return true
	}

	const handleInputBlur = (e: React.FocusEvent): 'cancel' | 'continue' => {
		if (e.relatedTarget === dialogTriggerRef.current) {
			return 'cancel'
		}

		return 'continue'
	}

	if (!isEditing) {
		return (
			<button
				type='button'
				onClick={() => setIsEditing(true)}
				className='flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-typography-500 transition-colors hover:bg-surface-200 hover:text-typography-600'
			>
				<PlusIcon size={ICON_SIZE_PX} />
				Add a card
			</button>
		)
	}

	return (
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
					<IconButton ref={dialogTriggerRef} className='mr-1 shrink-0'>
						<ArrowsOutIcon size={ICON_SIZE_PX} />
					</IconButton>
				}
				title={title}
				onSubmit={handleSubmit}
				onCancel={resetInput}
			/>
		</div>
	)
}
