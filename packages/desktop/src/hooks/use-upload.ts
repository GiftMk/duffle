import { getUploadUrl } from '#/lib/server'
import { fileStore, type PendingFile } from '#/state/file-store'

const sendUploadRequest = async (
	files: File[],
	onProgress?: (filename: string, percentage: number) => void,
) => {
	const promises = files.map(async (file) => {
		const url = await getUploadUrl({ data: { filename: file.name } })
		const xhr = new XMLHttpRequest()

		return new Promise<void>((resolve, reject) => {
			xhr.upload.addEventListener('progress', (event) => {
				if (event.lengthComputable) {
					const percentage = Math.round((event.loaded / event.total) * 100)
					onProgress?.(file.name, percentage)
				}
			})

			xhr.addEventListener('load', () => {
				if (xhr.status === 200) {
					resolve()
				} else {
					reject(`Failed to upload file '${file.name}', status: ${xhr.status}`)
				}
			})

			xhr.open('PUT', url, true)
			xhr.setRequestHeader('Content-Type', file.type)
			xhr.send(file)
		})
	})

	await Promise.all(promises)
}

export const useUpload = () => {
	const handleUpload = async (files: File[]) => {
		const pendingFiles: PendingFile[] = files.map((file) => ({
			name: file.name,
			progress: 0,
			size: file.size,
		}))

		fileStore.trigger.setPending({ files: pendingFiles })

		await sendUploadRequest(files, (filename, progress) =>
			fileStore.trigger.updateProgress({ filename, progress }),
		)
	}

	return {
		handleUpload,
	}
}
