import { type Draft, produce } from 'immer'

export const upsertItem = <T extends { id: string }>(
	items: T[] | undefined,
	item: T,
): T[] =>
	produce(items ?? [], (draft) => {
		const index = draft.findIndex((x) => x.id === item.id)
		if (index === -1) draft.push(item as Draft<T>)
		else draft[index] = item as Draft<T>
	})

export const upsertItems = <T extends { id: string }>(
	items: T[] | undefined,
	updates: T[],
): T[] =>
	produce(items ?? [], (draft) => {
		for (const update of updates) {
			const index = draft.findIndex((x) => x.id === update.id)
			if (index === -1) draft.push(update as Draft<T>)
			else draft[index] = update as Draft<T>
		}
	})

export const removeItem = <T extends { id: string }>(
	items: T[] | undefined,
	id: string,
): T[] =>
	produce(items ?? [], (draft) => {
		const index = draft.findIndex((x) => x.id === id)
		if (index !== -1) draft.splice(index, 1)
	})
