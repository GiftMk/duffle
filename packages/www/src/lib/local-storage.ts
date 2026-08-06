import type z from 'zod'

type ClientStorage<T> = {
	get: () => T | null
	set: (data: T) => void
	remove: () => void
}

export const createClientStorage = <T>(
	storage: Storage,
	key: string,
	schema: z.ZodType<T>,
): ClientStorage<T> => {
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

export class LocalEntityStore<T extends { id: string }> {
	private readonly storage: ClientStorage<T[]>

	constructor(key: string, schema: z.ZodType<T>) {
		this.storage = createClientStorage(localStorage, key, schema.array())
	}

	getAll(): T[] {
		const items = this.storage.get()
		return items ?? []
	}

	getById(id: string): T | undefined {
		return this.getAll().find((item) => item.id === id)
	}

	add(item: T) {
		const items = this.getAll()
		items.push(item)

		this.storage.set(items)
	}

	update(item: T) {
		const items = this.getAll()
		const index = items.findIndex(({ id }) => id === item.id)
		if (index === -1) {
			return
		}

		items.splice(index, 1, item)
		this.storage.set(items)
	}

	delete(id: string) {
		const items = this.getAll()
		const index = items.findIndex((item) => item.id === id)
		if (index === -1) {
			return
		}

		items.splice(index, 1)
		this.storage.set(items)
	}
}
