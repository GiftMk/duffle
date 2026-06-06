import type { app } from './app'

export type App = typeof app

export {
	type Document,
	documentSchema,
	type Transactional,
} from './routes/types'
