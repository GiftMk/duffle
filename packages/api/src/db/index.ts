import { drizzle } from 'drizzle-orm/pglite'

export const db = drizzle({ casing: 'snake_case' })
