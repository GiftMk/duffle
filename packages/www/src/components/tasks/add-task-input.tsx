import { type Ref, useRef } from 'react'

type AddTaskInputProps = {
	value: string
	ref: Ref<HTMLInputElement>
	onSubmit: (title: string, description?: string) => boolean
	onChange: (value: string) => void
	onCancel: () => void
	onBlur: (e: React.FocusEvent<HTMLInputElement>) => void
}

export const AddTaskInput = ({
	value,
	ref,
	onSubmit,
	onChange,
	onCancel,
	onBlur,
}: AddTaskInputProps) => {
	const cancelledRef = useRef(false)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.value)
	}

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		onBlur(e)

		if (cancelledRef.current) {
			cancelledRef.current = false
			onCancel()
			return
		}

		const success = onSubmit(value)

		if (!success) {
			onCancel()
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.currentTarget.blur()
		} else if (e.key === 'Escape') {
			cancelledRef.current = true
			e.currentTarget.blur()
		}
	}

	return (
		<input
			ref={ref}
			value={value}
			onChange={handleChange}
			onBlur={handleBlur}
			onKeyDown={handleKeyDown}
			placeholder='Card title'
			className='w-full border-0 bg-transparent px-3 py-2 text-sm text-typography-950 focus:outline-none'
		/>
	)
}
