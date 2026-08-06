import { ArrowsOutIcon, PlusIcon } from '@phosphor-icons/react'
import { useRef, useState } from 'react'
import { addTask } from '@/lib/actions'
import { ICON_SIZE_MD } from '@/lib/constants'
import { IconButton } from '@/components/icon-button'
import { TitleInput } from '@/components/title-input'
import { TaskDialog } from './task-dialog'

type AddTaskCardProps = {
	columnId: string
}

export const AddTaskCard = ({ columnId }: AddTaskCardProps) => {
	const [isEditing, setIsEditing] = useState(false)
	const [title, setTitle] = useState('')
	const dialogTriggerRef = useRef<HTMLButtonElement>(null)

	const resetInput = () => {
		setIsEditing(false)
		setTitle('')
	}

	const handleSubmit = (title: string, description?: string) => {
		addTask(columnId, title, description)
		resetInput()
	}

	const handleInputBlur = (e: React.FocusEvent) => {
		return e.relatedTarget === dialogTriggerRef.current ? 'break' : 'continue'
	}

	if (!isEditing) {
		return (
			<button
				type='button'
				onClick={() => setIsEditing(true)}
				className='flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-typography-500 transition-colors hover:bg-surface-200 hover:text-typography-600'
			>
				<PlusIcon size={ICON_SIZE_MD} />
				Add a card
			</button>
		)
	}

	return (
		<div className='flex items-center gap-2 rounded-md'>
			<TitleInput
				value={title}
				onChange={setTitle}
				onSubmit={handleSubmit}
				onCancel={resetInput}
				onBlur={handleInputBlur}
				placeholder='Task title'
				className='mx-2 w-full'
			/>
			<TaskDialog
				trigger={
					<IconButton ref={dialogTriggerRef} className='mr-1 shrink-0'>
						<ArrowsOutIcon size={ICON_SIZE_MD} />
					</IconButton>
				}
				title={title}
				onSubmit={handleSubmit}
				onCancel={resetInput}
				submitLabel='Create'
			/>
		</div>
	)
}
