import { useSelector } from '@xstate/store-react'
import {
	fileStore,
	type PendingFile,
	type PersistedFile,
} from '#/state/file-store'

export const useFile = (filename: string) => {
	const file = useSelector(
		fileStore,
		(store) => store.context.pending[filename],
	)

	if (!file) {
		throw new Error(`File '${filename}' not found`)
	}

	return file
}

const pendingFileComparator = (a: PendingFile, b: PendingFile) => {
	const sizeDiff = b.size - a.size
	return sizeDiff === 0 ? a.name.localeCompare(b.name) : sizeDiff
}

const persistedFileComparator = (a: PersistedFile, b: PersistedFile) => {
	const dateA = new Date(a.uploadedAt)
	const dateB = new Date(b.uploadedAt)

	const dateDiff = dateB.getTime() - dateA.getTime()

	if (dateDiff === 0) {
		return a.name.localeCompare(b.name)
	}

	return dateDiff
}

export const useFiles = () => {
	const files = useSelector(fileStore, (store) => store.context)
	return {
		pending: Object.values(files.pending).sort(pendingFileComparator),
		persisted: Object.values(files.persisted).sort(persistedFileComparator),
	}
}
