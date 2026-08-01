import { PencilSimpleIcon } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { updateColumn } from '@/lib/actions'
import { ICON_SIZE_PX } from '@/lib/constants'

type ColumnTitleProps = {
	id: string
	title: string
}

export const ColumnTitle = ({ id, title }: ColumnTitleProps) => {
	const [isEditing, setIsEditing] = useState(false)
	const [value, setValue] = useState(title)
	const cancelledRef = useRef(false)
	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (isEditing) {
			inputRef.current?.focus()
		}
	}, [isEditing])

	const startEditing = () => {
		setValue(title)
		setIsEditing(true)
	}

	const handleBlur = () => {
		setIsEditing(false)

		if (cancelledRef.current) {
			cancelledRef.current = false
			return
		}

		updateColumn(id, (draft) => {
			const trimmedTitle = value.trim()
			if (trimmedTitle) {
				draft.title = trimmedTitle
			}
		})
	}

	if (!isEditing) {
		return (
			<div className='group flex items-center justify-between px-1'>
				<h2 className='font-semibold text-sm text-typography-950'>{title}</h2>
				<button
					onClick={startEditing}
					type='button'
					className='text-typography-600 opacity-0 transition-opacity hover:text-typography-950 focus-visible:opacity-100 group-hover:opacity-100'
				>
					<PencilSimpleIcon size={ICON_SIZE_PX} />
				</button>
			</div>
		)
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value)
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.currentTarget.blur()
		}
		if (e.key === 'Escape') {
			cancelledRef.current = true
			e.currentTarget.blur()
		}
	}

	return (
		<input
			ref={inputRef}
			value={value}
			onChange={handleChange}
			onBlur={handleBlur}
			onKeyDown={handleKeyDown}
			className='w-full rounded-md border border-surface-400 bg-surface-100 px-3 py-2 text-sm text-typography-950 focus:outline-none'
		/>
	)
}
