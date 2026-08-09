import { createServerFn } from '@tanstack/react-start'
import { type SQL, sql } from 'drizzle-orm'
import { z } from 'zod'
import type { Database } from '@/db'
import { embed } from '@/server/embeddings'
import { withDb } from '@/server/middleware'
import { requireSession } from '@/server/session.server'

const RRF_K = 60
const RESULT_LIMIT = 20
const SOURCE_LIMIT = 20

type RawRow = Record<string, unknown>

const runSql = (db: Database, query: SQL): Promise<{ rows: RawRow[] }> =>
	(
		db as unknown as {
			execute(query: SQL): Promise<{ rows: RawRow[] }>
		}
	).execute(query)

const embeddingLiteral = (vec: number[]) => sql`${JSON.stringify(vec)}::vector`

const fusionCtes = (
	table: 'notes' | 'tasks',
	userId: string,
	query: string,
	queryEmbedding: number[] | undefined,
): SQL => {
	const tbl = sql.raw(table)
	const ctes: SQL[] = [
		sql`trigram AS (
			SELECT id, ROW_NUMBER() OVER (ORDER BY similarity(title, ${query}) DESC) AS rank
			FROM ${tbl}
			WHERE user_id = ${userId} AND title % ${query}
			ORDER BY similarity(title, ${query}) DESC
			LIMIT ${SOURCE_LIMIT}
		)`,
		sql`fts AS (
			SELECT id, ROW_NUMBER() OVER (ORDER BY ts_rank_cd(search_vector, websearch_to_tsquery('english', ${query})) DESC) AS rank
			FROM ${tbl}
			WHERE user_id = ${userId} AND search_vector @@ websearch_to_tsquery('english', ${query})
			ORDER BY ts_rank_cd(search_vector, websearch_to_tsquery('english', ${query})) DESC
			LIMIT ${SOURCE_LIMIT}
		)`,
	]

	if (queryEmbedding) {
		const emb = embeddingLiteral(queryEmbedding)
		ctes.push(
			sql`semantic AS (
				SELECT id, ROW_NUMBER() OVER (ORDER BY embedding <=> ${emb}) AS rank
				FROM ${tbl}
				WHERE user_id = ${userId} AND embedding IS NOT NULL
				ORDER BY embedding <=> ${emb}
				LIMIT ${SOURCE_LIMIT}
			)`,
		)
	}

	return sql.join(ctes, sql`, `)
}

const rrfScore = (queryEmbedding: number[] | undefined): SQL => {
	const parts = [
		sql`COALESCE(1.0 / (${RRF_K}::int + trigram.rank), 0)`,
		sql`COALESCE(1.0 / (${RRF_K}::int + fts.rank), 0)`,
	]
	if (queryEmbedding) {
		parts.push(sql`COALESCE(1.0 / (${RRF_K}::int + semantic.rank), 0)`)
	}
	return sql.join(parts, sql` + `)
}

export const searchNotes = async (
	db: Database,
	userId: string,
	query: string,
	queryEmbedding: number[] | undefined,
) => {
	const { rows } = await runSql(
		db,
		sql`
		WITH ${fusionCtes('notes', userId, query, queryEmbedding)}
		SELECT n.id, n.title, ${rrfScore(queryEmbedding)} AS rrf_score
		FROM notes n
		LEFT JOIN trigram ON trigram.id = n.id
		LEFT JOIN fts ON fts.id = n.id
		${queryEmbedding ? sql`LEFT JOIN semantic ON semantic.id = n.id` : sql``}
		WHERE n.user_id = ${userId}
			AND (trigram.id IS NOT NULL OR fts.id IS NOT NULL${queryEmbedding ? sql` OR semantic.id IS NOT NULL` : sql``})
		ORDER BY rrf_score DESC
		LIMIT ${RESULT_LIMIT}
	`,
	)

	return rows.map((row) => ({
		id: row.id as string,
		title: row.title as string,
		type: 'note' as const,
		score: Number.parseFloat(row.rrf_score as string),
	}))
}

export const searchTasks = async (
	db: Database,
	userId: string,
	query: string,
	queryEmbedding: number[] | undefined,
) => {
	const { rows } = await runSql(
		db,
		sql`
		WITH ${fusionCtes('tasks', userId, query, queryEmbedding)}
		SELECT t.id, t.title, c.board_id, ${rrfScore(queryEmbedding)} AS rrf_score
		FROM tasks t
		JOIN columns c ON c.id = t.column_id
		LEFT JOIN trigram ON trigram.id = t.id
		LEFT JOIN fts ON fts.id = t.id
		${queryEmbedding ? sql`LEFT JOIN semantic ON semantic.id = t.id` : sql``}
		WHERE t.user_id = ${userId}
			AND (trigram.id IS NOT NULL OR fts.id IS NOT NULL${queryEmbedding ? sql` OR semantic.id IS NOT NULL` : sql``})
		ORDER BY rrf_score DESC
		LIMIT ${RESULT_LIMIT}
	`,
	)

	return rows.map((row) => ({
		id: row.id as string,
		title: row.title as string,
		type: 'task' as const,
		boardId: row.board_id as string,
		score: Number.parseFloat(row.rrf_score as string),
	}))
}

const sortByScore = <T extends { score: number }>(items: T[]): T[] =>
	[...items].sort((a, b) => b.score - a.score)

export const searchFn = createServerFn({ method: 'GET' })
	.middleware([withDb])
	.validator(z.object({ query: z.string().trim().min(1) }))
	.handler(async ({ data, context }) => {
		const { user } = await requireSession()

		let queryEmbedding: number[] | undefined
		try {
			queryEmbedding = await embed(data.query)
		} catch (error) {
			console.error(
				'Failed to embed search query, falling back to lexical search',
				error,
			)
		}

		const [notes, tasks] = await Promise.all([
			searchNotes(context.db, user.id, data.query, queryEmbedding),
			searchTasks(context.db, user.id, data.query, queryEmbedding),
		])

		return sortByScore([...notes, ...tasks]).slice(0, RESULT_LIMIT)
	})
