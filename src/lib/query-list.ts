export const upsertItem = <T extends { id: string }>(
	items: T[] | undefined,
	item: T,
): T[] => {
	const list = items ?? []
	const index = list.findIndex((existing) => existing.id === item.id)
	if (index === -1) return [...list, item]
	return list.map((existing) => (existing.id === item.id ? item : existing))
}

export const removeItem = <T extends { id: string }>(
	items: T[] | undefined,
	id: string,
): T[] => (items ?? []).filter((item) => item.id !== id)
