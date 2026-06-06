import cors from '@elysiajs/cors'
import logixlysia from 'logixlysia'
import { app } from './app'
import { env } from '../environment'
import { runMigrations } from './db'

await runMigrations()
app.use(cors()).use(logixlysia())
app.listen(env.PORT)
