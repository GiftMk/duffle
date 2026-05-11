import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs))
}

export const randInt = (min: number, max: number) => {
	const maxFloor = Math.floor(max)
	const minCeil = Math.ceil(min)

	return Math.floor(Math.random() * (maxFloor - minCeil + 1) + minCeil)
}
