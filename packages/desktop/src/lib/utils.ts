import { Avatar, Style } from '@dicebear/core'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import artStyle from '@dicebear/styles/notionists.json' with { type: 'json' }
import type { FileAsset } from '#/types'

export const prettyTimestamp = (timestamp: string) => {
	const date = new Date(timestamp)
	return new Intl.DateTimeFormat('en-US', {
		dateStyle: 'long',
		timeStyle: 'short',
	}).format(date)
}

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs))
}

const AVATAR_STYLE = new Style(artStyle)
const AVATAR_SIZE_PX = 104
const AVATAR_BG_COLOUR = 'ffffff00'

export const createAvatar = (seed?: string) => {
	return new Avatar(AVATAR_STYLE, {
		seed,
		size: AVATAR_SIZE_PX,
		backgroundColor: AVATAR_BG_COLOUR,
	}).toDataUri()
}

export const fileComparator = (a: FileAsset, b: FileAsset) => {
	const dateA = new Date(a.uploadedAt)
	const dateB = new Date(b.uploadedAt)

	const dateDiff = dateB.getTime() - dateA.getTime()

	if (dateDiff === 0) {
		return a.name.localeCompare(b.name)
	}

	return dateDiff
}
