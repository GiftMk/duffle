import { getUploadUrl } from '#/lib/server'

export const uploadFiles = async (...files: File[]) => {
	const promises = files.map(async (file) => {
		const url = await getUploadUrl({ data: { filename: file.name } })
		const response = await fetch(url, {
			method: 'PUT',
			body: file,
			headers: {
				'Content-Type': file.type,
			},
		})

		if (!response.ok) {
			throw new Error(`Failed to upload file ${file.name}`)
		}
	})

	await Promise.all(promises)
}
