import { isNull, type SQL, sql } from 'drizzle-orm'
import { createDb, type Database } from '@/db'
import { tasksTable } from '@/db/schema.kanban'
import { notesTable } from '@/db/schema.notes'
import { generateEmbedding } from '@/server/embeddings'

const CONCURRENCY = 10

type RawRow = Record<string, unknown>

const runSql = (db: Database, query: SQL): Promise<{ rows: RawRow[] }> =>
	(
		db as unknown as {
			execute(query: SQL): Promise<{ rows: RawRow[] }>
		}
	).execute(query)

type BackfillRow = { id: string; title: string; content: string | null }

const runWithConcurrency = async <T>(
	items: T[],
	concurrency: number,
	task: (item: T) => Promise<void>,
) => {
	let next = 0
	const workers = Array.from(
		{ length: Math.min(concurrency, items.length) },
		async () => {
			while (next < items.length) {
				const index = next++
				const item = items[index]
				if (item === undefined) {
					continue
				}
				await task(item)
			}
		},
	)
	await Promise.all(workers)
}

const backfill = async (
	db: Database,
	table: typeof notesTable | typeof tasksTable,
	tableName: string,
	contentColumn: typeof notesTable.body | typeof tasksTable.description,
	label: string,
) => {
	const rows = (await db
		.select({ id: table.id, title: table.title, content: contentColumn })
		.from(table)
		.where(isNull(table.embedding))) as BackfillRow[]

	if (rows.length === 0) {
		console.log(`${label}: nothing to backfill`)
		return
	}

	console.log(`${label}: backfilling ${rows.length} rows`)

	let done = 0
	const tableRef = sql.raw(tableName)
	await runWithConcurrency(rows, CONCURRENCY, async (row) => {
		try {
			const embedding = await generateEmbedding(row.title, row.content)
			await runSql(
				db,
				sql`UPDATE ${tableRef} SET embedding = ${JSON.stringify(embedding)}::vector WHERE id = ${row.id}`,
			)
		} catch (error) {
			console.error(`${label}: failed to embed ${row.id}`, error)
		}
		done++
		if (done % 100 === 0) {
			console.log(`${label}: ${done}/${rows.length}`)
		}
	})

	console.log(`${label}: complete (${done}/${rows.length})`)
}

const closeDb = async (db: Database) => {
	const client = (db as unknown as { $client?: { end?: () => Promise<void> } })
		.$client
	await client?.end?.()
}

const main = async () => {
	const db = await createDb()
	try {
		await backfill(db, notesTable, 'notes', notesTable.body, 'notes')
		await backfill(db, tasksTable, 'tasks', tasksTable.description, 'tasks')
	} finally {
		await closeDb(db)
	}
}

await main()
