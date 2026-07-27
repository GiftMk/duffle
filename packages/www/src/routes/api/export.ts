import { createFileRoute } from '@tanstack/react-router'
// Side-effect-only: pulls in @tanstack/start-client-core's declaration
// merge that adds `server` to createFileRoute's options type. Without
// this, nothing in the program imports @tanstack/react-start and `server`
// type-errors as an unknown property under `tsc -b`.
import type {} from '@tanstack/react-start'
import { type HandleUploadBody, handleUpload } from '@vercel/blob/client'

export const Route = createFileRoute('/api/export')({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const body = (await request.json()) as HandleUploadBody

				try {
					const jsonResponse = await handleUpload({
						body,
						request,
						onBeforeGenerateToken: async () => ({
							allowedContentTypes: ['application/json'],
							addRandomSuffix: false,
						}),
						onUploadCompleted: async ({ blob }) => {
							console.log('export uploaded', blob.url)
						},
					})

					return Response.json(jsonResponse)
				} catch (error) {
					return Response.json(
						{ error: (error as Error).message },
						{ status: 400 },
					)
				}
			},
		},
	},
})
