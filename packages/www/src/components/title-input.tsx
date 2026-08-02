import { Input } from '@base-ui/react'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

type TitleInputProps = {
	value: string
	onChange: (value: string) => void
	onSubmit: (title: string) => void
	onCancel: () => void
	placeholder?: string
	onBlur?: (event: React.FocusEvent) => 'break' | 'continue'
	className?: string
}

export const TitleInput = ({
	value,
	onChange,
	placeholder,
	onSubmit,
	onCancel,
	className,
	onBlur,
}: TitleInputProps) => {
	const cancelledRef = useRef(false)
	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		inputRef.current?.focus()
	}, [])

	const handleBlur = (e: React.FocusEvent) => {
		if (onBlur?.(e) === 'break') {
			return
		}

		if (cancelledRef.current) {
			cancelledRef.current = false
			onCancel()
			return
		}

		const trimmedTitle = value.trim()
		if (!trimmedTitle) {
			onCancel()
			return
		}

		onSubmit(trimmedTitle)
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

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.value)
	}

	const handleClick = (e: React.MouseEvent) => {
		e.stopPropagation()
	}

	return (
		<Input
			ref={inputRef}
			value={value}
			onChange={handleChange}
			onBlur={handleBlur}
			onKeyDown={handleKeyDown}
			onClick={handleClick}
			placeholder={placeholder}
			className={cn(
				'field-sizing-content w-fit bg-transparent text-sm text-typography-950 shadow-[inset_0_-1px_0_0_var(--color-surface-400)] focus:outline-none',
				className,
			)}
		/>
	)
}
