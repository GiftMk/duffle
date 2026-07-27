import { createFileRoute } from '@tanstack/react-router'
// Side-effect-only: see routes/api/export.ts for why this import is needed
// for `server` to type-check under `tsc -b`.
import type {} from '@tanstack/react-start'
import { list } from '@vercel/blob'

export const Route = createFileRoute('/api/import/$code')({
	server: {
		handlers: {
			GET: async ({ params }) => {
				try {
					const { blobs } = await list({ prefix: params.code, limit: 1 })
					const blob = blobs.find((blob) => blob.pathname === params.code)

					if (!blob) {
						return Response.json({ error: 'Not found' }, { status: 404 })
					}

					const res = await fetch(blob.url)
					const json = await res.json()
					return Response.json(json)
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
