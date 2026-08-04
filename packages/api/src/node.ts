import { serve } from '@hono/node-server'
import app from './index'

serve(app, ({ port }) => {
	console.log(`App started on port ${port} 🥹`)
})
