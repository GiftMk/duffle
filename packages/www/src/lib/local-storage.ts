import type z from 'zod'

type SafeStorage<T> = {
	get: () => T | null
	set: (data: T) => void
	remove: () => void
}

export const createSafeStorage = <T>(
	storage: Storage,
	key: string,
	schema: z.ZodType<T>,
): SafeStorage<T> => {
	return {
		get: (): T | null => {
			const raw = storage.getItem(key)
			if (!raw) return null
			try {
				return schema.parse(JSON.parse(raw))
			} catch (err) {
				console.warn(
					`[ClientStorage] Invalid data found under key: "${key}"`,
					err,
				)
				return null
			}
		},
		set: (data: T): void => {
			const validated = schema.parse(data)
			storage.setItem(key, JSON.stringify(validated))
		},
		remove: (): void => {
			storage.removeItem(key)
		},
	}
}
