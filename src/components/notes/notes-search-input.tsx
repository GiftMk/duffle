import {
	MagnifyingGlassIcon,
	SpinnerGapIcon,
	XIcon,
} from '@phosphor-icons/react'
import { ICON_SIZE_MD } from '@/lib/constants'

type NotesSearchInputProps = {
	value: string
	onChange: (value: string) => void
	isLoading?: boolean
}

export const NotesSearchInput = ({
	value,
	onChange,
	isLoading,
}: NotesSearchInputProps) => {
	return (
		<div className='mt-6 flex w-full max-w-md items-center gap-2 rounded-md border border-surface-400 bg-surface-50 px-3 py-2 text-typography-950 focus-within:border-surface-600'>
			<MagnifyingGlassIcon
				size={ICON_SIZE_MD}
				className='shrink-0 text-surface-600'
			/>
			<input
				type='text'
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder='Search notes...'
				className='w-full bg-transparent placeholder:text-surface-500 focus:outline-none'
			/>
			<div
				style={{ width: ICON_SIZE_MD, height: ICON_SIZE_MD }}
				className='flex shrink-0 items-center justify-center'
			>
				{isLoading ? (
					<SpinnerGapIcon
						size={ICON_SIZE_MD}
						className='animate-spin text-surface-600'
					/>
				) : (
					value && (
						<button
							type='button'
							onClick={() => onChange('')}
							className='flex h-full w-full items-center justify-center text-surface-600 hover:text-typography-950'
						>
							<XIcon size={ICON_SIZE_MD} weight='bold' />
						</button>
					)
				)}
			</div>
		</div>
	)
}
