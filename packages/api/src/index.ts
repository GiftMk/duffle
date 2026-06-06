import cors from '@elysiajs/cors'
import logixlysia from 'logixlysia'
import { env } from '../environment'
import { app } from './app'
import { runMigrations } from './db'

await runMigrations()
app.use(cors()).use(logixlysia())
app.listen(env.PORT)
