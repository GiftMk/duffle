import {
	GetObjectCommand,
	HeadObjectCommand,
	PutObjectCommand,
	paginateListObjectsV2,
	S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createServerFn } from '@tanstack/react-start'
import { env } from '#/env'
import type { PersistedFile } from '#/state/file-store'

const s3Client = new S3Client()

export const getDownloadUrl = createServerFn()
	.validator((data: { filename: string }) => data)
	.handler(async ({ data }) => {
		const command = new GetObjectCommand({
			Bucket: env.S3_BUCKET,
			Key: data.filename,
		})

		return await getSignedUrl(s3Client, command)
	})

export const getUploadUrl = createServerFn()
	.validator((data: { filename: string }) => data)
	.handler(async ({ data }) => {
		const command = new PutObjectCommand({
			Bucket: env.S3_BUCKET,
			Key: data.filename,
		})

		return await getSignedUrl(s3Client, command)
	})

export const getAllFiles = createServerFn().handler(async () => {
	const files: PersistedFile[] = []
	const pages = paginateListObjectsV2(
		{ client: s3Client },
		{ Bucket: env.S3_BUCKET },
	)

	for await (const page of pages) {
		if (!page.Contents) {
			continue
		}

		for (const content of page.Contents) {
			if (!content.Key || !content.LastModified || !content.Size) {
				continue
			}

			files.push({
				name: content.Key,
				uploadedAt: content.LastModified.toISOString(),
				size: content.Size,
			})
		}
	}

	return files
})

export const fileExists = createServerFn()
	.validator((data: { filename: string }) => data)
	.handler(async ({ data }) => {
		try {
			await s3Client.send(
				new HeadObjectCommand({
					Bucket: env.S3_BUCKET,
					Key: data.filename,
				}),
			)

			return true
		} catch (e) {
			if (e instanceof Error && e.name === 'NotFound') {
				return false
			}

			throw e
		}
	})
