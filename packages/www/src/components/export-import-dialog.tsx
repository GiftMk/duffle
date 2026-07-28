import { Dialog } from '@base-ui/react'
import {
	ArrowsLeftRightIcon,
	CheckIcon,
	CloudArrowDownIcon,
	CloudArrowUpIcon,
	CopyIcon,
	SpinnerGapIcon,
	XIcon,
} from '@phosphor-icons/react'
import { useState } from 'react'
import { useCurrentNote } from '@/components/note-provider'
import { Tooltip } from '@/components/tooltip'
import { ICON_SIZE_PX } from '@/lib/constants'
import type { Note } from '@/lib/db'
import { exportNotes } from '@/lib/export'
import { fetchImportPreview, importNotes } from '@/lib/import'
import { cn } from '@/lib/utils'

type Mode = 'export' | 'import'

export const ExportImportDialog = () => {
	const [open, setOpen] = useState(false)
	const [mode, setMode] = useState<Mode>('export')

	const closeDialog = () => setOpen(false)

	return (
		<Dialog.Root
			open={open}
			onOpenChange={(next) => {
				setOpen(next)
				if (!next) {
					setMode('export')
				}
			}}
		>
			<Tooltip content='Export / Import'>
				<Dialog.Trigger
					render={
						<button
							type='button'
							className='flex h-fit w-fit items-center justify-center rounded-full border border-surface-400 bg-surface-100 p-2 text-typography-600 transition-all duration-75 hover:scale-125 hover:bg-surface-300/50 focus:outline-none'
						>
							<ArrowsLeftRightIcon size={ICON_SIZE_PX} weight='bold' />
						</button>
					}
				/>
			</Tooltip>
			<Dialog.Portal>
				<Dialog.Popup className='fixed top-44 left-1/2 w-md -translate-x-1/2 rounded-md border border-surface-400 bg-surface-100 py-4 shadow-2xl shadow-surface-400/50 focus:outline-none'>
					<Dialog.Close
						onClick={closeDialog}
						className='absolute top-2 right-2 rounded-full p-1.5 text-surface-800 hover:bg-surface-300'
					>
						<XIcon size={ICON_SIZE_PX} weight='bold' />
					</Dialog.Close>
					<div className='flex flex-col gap-6 px-4'>
						<div className='flex w-fit gap-1 rounded-full border border-surface-400 p-1'>
							<button
								type='button'
								onClick={() => setMode('export')}
								className={cn(
									'rounded-full px-3 py-1 text-sm transition-colors',
									mode === 'export'
										? 'bg-surface-300 text-typography-950'
										: 'text-typography-600',
								)}
							>
								Export
							</button>
							<button
								type='button'
								onClick={() => setMode('import')}
								className={cn(
									'rounded-full px-3 py-1 text-sm transition-colors',
									mode === 'import'
										? 'bg-surface-300 text-typography-950'
										: 'text-typography-600',
								)}
							>
								Import
							</button>
						</div>
						{mode === 'export' ? (
							<ExportPanel />
						) : (
							<ImportPanel onDone={closeDialog} />
						)}
					</div>
				</Dialog.Popup>
			</Dialog.Portal>
		</Dialog.Root>
	)
}

const ExportPanel = () => {
	const [code, setCode] = useState<string | null>(null)
	const [copied, setCopied] = useState(false)
	const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')

	const handleGenerate = async () => {
		setStatus('loading')
		try {
			const name = await exportNotes()
			setCode(name)
			setStatus('idle')
		} catch {
			setStatus('error')
		}
	}

	const handleCopy = async () => {
		if (!code) return
		await navigator.clipboard.writeText(code)
		setCopied(true)
		setTimeout(() => setCopied(false), 1500)
	}

	return (
		<div className='flex flex-col gap-6 pb-4'>
			<p className='text-sm text-typography-600'>
				{code
					? 'Enter this code on your other device to continue your notes there.'
					: 'Upload all of your notes and get a code you can use to continue them on another device.'}
			</p>
			<div className='flex items-center gap-2'>
				<input
					value={code ?? ''}
					disabled
					placeholder='Code will appear here'
					className='h-full w-full rounded-md border border-surface-400 bg-surface-100 px-3 py-2 font-mono text-sm disabled:opacity-60'
				/>
				<Tooltip
					content={
						code ? (copied ? 'Copied' : 'Copy code') : 'Generate export code'
					}
				>
					<button
						type='button'
						onClick={code ? handleCopy : handleGenerate}
						disabled={status === 'loading'}
						aria-label={code ? 'Copy code' : 'Generate export code'}
						className='flex items-center justify-center rounded-md border border-surface-400 bg-surface-100 px-3 py-2 text-typography-600 transition-colors hover:bg-surface-300/50 disabled:opacity-60'
					>
						{status === 'loading' ? (
							<SpinnerGapIcon
								size={ICON_SIZE_PX}
								weight='bold'
								className='animate-spin'
							/>
						) : code ? (
							copied ? (
								<CheckIcon size={ICON_SIZE_PX} weight='bold' />
							) : (
								<CopyIcon size={ICON_SIZE_PX} weight='bold' />
							)
						) : (
							<CloudArrowUpIcon size={ICON_SIZE_PX} weight='bold' />
						)}
					</button>
				</Tooltip>
			</div>
			{status === 'error' && (
				<p className='text-red-500 text-xs'>
					Something went wrong uploading your notes. Try again.
				</p>
			)}
		</div>
	)
}

type ImportPanelProps = {
	onDone: () => void
}

const ImportPanel = ({ onDone }: ImportPanelProps) => {
	const currentNote = useCurrentNote()
	const [code, setCode] = useState('')
	const [notes, setNotes] = useState<Note[] | null>(null)
	const [status, setStatus] = useState<
		'idle' | 'loading' | 'error' | 'importing'
	>('idle')
	const [error, setError] = useState<string | null>(null)

	const handleLookup = async () => {
		if (!code.trim()) return
		setStatus('loading')
		setError(null)
		try {
			const found = await fetchImportPreview(code.trim())
			setNotes(found)
			setStatus('idle')
		} catch (err) {
			setError((err as Error).message)
			setStatus('error')
		}
	}

	const handleImport = async () => {
		if (!notes) return

		setStatus('importing')
		await importNotes(notes)
		currentNote.reload()
		onDone()
	}

	return (
		<div className='flex flex-col gap-6 pb-4'>
			<p className='text-sm text-typography-600'>
				Enter the code you generated on your other device.
			</p>
			<div className='flex items-center gap-2'>
				<input
					value={code}
					onChange={(e) => setCode(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter') handleLookup()
					}}
					placeholder='brave-otter-42'
					className='h-full w-full rounded-md border border-surface-400 bg-surface-100 px-3 py-2 text-sm focus:outline-none'
				/>
				<Tooltip content='Look up code'>
					<button
						type='button'
						onClick={handleLookup}
						disabled={status === 'loading'}
						aria-label='Look up code'
						className='flex items-center justify-center rounded-md border border-surface-400 bg-surface-100 px-3 py-2 text-typography-600 transition-colors hover:bg-surface-300/50 disabled:opacity-60'
					>
						{status === 'loading' ? (
							<SpinnerGapIcon
								size={ICON_SIZE_PX}
								weight='bold'
								className='animate-spin'
							/>
						) : (
							<CloudArrowDownIcon size={ICON_SIZE_PX} weight='bold' />
						)}
					</button>
				</Tooltip>
			</div>
			{status === 'error' && error && (
				<p className='text-red-500 text-xs'>{error}</p>
			)}
			{notes && (
				<div className='flex flex-col gap-6 rounded-md border border-surface-400 bg-surface-200 p-3'>
					<p className='text-sm'>
						Found {notes.length} note{notes.length === 1 ? '' : 's'}.
					</p>
					<button
						type='button'
						onClick={() => handleImport()}
						disabled={status === 'importing'}
						className='w-full rounded-md border border-surface-400 bg-surface-100 py-2 text-sm transition-colors hover:bg-surface-300/50 disabled:opacity-60'
					>
						Import
					</button>
				</div>
			)}
		</div>
	)
}
