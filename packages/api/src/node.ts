import { serve } from '@hono/node-server'
import app from './index.js'

serve(app, ({ port }) => {
	console.log(`App started on port ${port} 🥹`)
})
