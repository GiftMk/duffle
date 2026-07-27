import { Dialog } from '@base-ui/react'
import {
	ArrowsLeftRightIcon,
	CheckIcon,
	CopyIcon,
	SpinnerGapIcon,
	XIcon,
} from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
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
			<Dialog.Trigger
				render={
					<button
						type='button'
						className='flex h-fit w-fit items-center justify-center rounded-full border border-surface-400 bg-surface-100 p-2 text-typography-600 transition-all duration-75 hover:scale-125 hover:bg-surface-300/50 focus:outline-none'
					>
						<ArrowsLeftRightIcon size={ICON_SIZE_PX} />
					</button>
				}
			/>
			<Dialog.Portal>
				<Dialog.Popup className='fixed top-44 left-1/2 w-md -translate-x-1/2 rounded-md border border-surface-400 bg-surface-100 py-4 shadow-2xl shadow-surface-400/50 focus:outline-none'>
					<Dialog.Close
						onClick={closeDialog}
						className='absolute top-2 right-2 rounded-full p-1.5 text-surface-800 hover:bg-surface-300'
					>
						<XIcon size={ICON_SIZE_PX} />
					</Dialog.Close>
					<div className='flex flex-col gap-4 px-4'>
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

	if (!code) {
		return (
			<div className='flex flex-col gap-3 pb-4'>
				<p className='text-sm text-typography-600'>
					Upload all of your notes and get a code you can use to continue them
					on another device.
				</p>
				<button
					type='button'
					onClick={handleGenerate}
					disabled={status === 'loading'}
					className='flex items-center justify-center gap-2 rounded-md border border-surface-400 bg-surface-100 py-2 text-sm transition-colors hover:bg-surface-300/50 disabled:opacity-60'
				>
					{status === 'loading' && (
						<SpinnerGapIcon size={ICON_SIZE_PX} className='animate-spin' />
					)}
					Generate export code
				</button>
				{status === 'error' && (
					<p className='text-red-500 text-xs'>
						Something went wrong uploading your notes. Try again.
					</p>
				)}
			</div>
		)
	}

	return (
		<div className='flex flex-col gap-3 pb-4'>
			<p className='text-sm text-typography-600'>
				Enter this code on your other device to continue your notes there.
			</p>
			<div className='flex items-center justify-between gap-2 rounded-md border border-surface-400 bg-surface-200 px-4 py-3'>
				<span className='font-bold font-mono text-lg'>{code}</span>
				<button
					type='button'
					onClick={handleCopy}
					className='rounded-full p-1.5 text-typography-600 hover:bg-surface-300'
				>
					{copied ? (
						<CheckIcon size={ICON_SIZE_PX} />
					) : (
						<CopyIcon size={ICON_SIZE_PX} />
					)}
				</button>
			</div>
		</div>
	)
}

type ImportPanelProps = {
	onDone: () => void
}

const ImportPanel = ({ onDone }: ImportPanelProps) => {
	const navigate = useNavigate()
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

	const handleImport = async (mode: 'replace' | 'merge') => {
		if (!notes) return

		if (
			mode === 'replace' &&
			!window.confirm(
				'This deletes all your local notes and replaces them with the imported ones. Continue?',
			)
		) {
			return
		}

		setStatus('importing')
		await importNotes(notes, mode)
		onDone()
		navigate({ to: '/' })
	}

	return (
		<div className='flex flex-col gap-3 pb-4'>
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
				<button
					type='button'
					onClick={handleLookup}
					disabled={status === 'loading'}
					className='rounded-md border border-surface-400 bg-surface-100 px-3 py-2 text-sm transition-colors hover:bg-surface-300/50 disabled:opacity-60'
				>
					Look up
				</button>
			</div>
			{status === 'error' && error && (
				<p className='text-red-500 text-xs'>{error}</p>
			)}
			{notes && (
				<div className='flex flex-col gap-2 rounded-md border border-surface-400 bg-surface-200 p-3'>
					<p className='text-sm'>
						Found {notes.length} note{notes.length === 1 ? '' : 's'}.
					</p>
					<div className='flex gap-2'>
						<button
							type='button'
							onClick={() => handleImport('merge')}
							disabled={status === 'importing'}
							className='flex-1 rounded-md border border-surface-400 bg-surface-100 py-2 text-sm transition-colors hover:bg-surface-300/50 disabled:opacity-60'
						>
							Merge
						</button>
						<button
							type='button'
							onClick={() => handleImport('replace')}
							disabled={status === 'importing'}
							className='flex-1 rounded-md border border-surface-400 bg-surface-100 py-2 text-red-500 text-sm transition-colors hover:bg-surface-300/50 disabled:opacity-60'
						>
							Replace
						</button>
					</div>
				</div>
			)}
		</div>
	)
}
