# Postgres-Backed Hybrid Search for Notes & Tasks

## Context

Search today is effectively broken: `packages/www/src/lib/search.worker.ts` runs `minisearch` in a web worker over an in-memory index that is **never populated** (`add`/`update` are called nowhere), and it only ever covered task titles — not notes, not bodies/descriptions. Meanwhile `hooks/notes.ts` and `hooks/tasks.ts` eagerly load every note/task body into the client on first load (`staleTime: Infinity`).

Goal: move search to Postgres, searching both **notes** (`title`, `body`) and **tasks** (`title`, `description`), combining three signals — typo-tolerant title matching, keyword/phrase matching over body text, and semantic/meaning-based matching — into one ranked result list.

Research converged clearly: the standard pattern for this exact problem (title + body, want typo tolerance + keyword + semantic) is **`pg_trgm` (trigram similarity) + Postgres full-text search (`tsvector`/`ts_rank_cd`) + `pgvector` (semantic embeddings), fused with Reciprocal Rank Fusion (RRF)**. This is the same recipe used in Supabase's and ParadeDB's hybrid search guides, reported to lift precision from ~62% (vector-only) to ~84%+ (hybrid+RRF).

Why all three, not fewer:
- **pg_trgm** handles typos/fuzzy substring matches on short strings (titles), but doesn't stem words, doesn't parse multi-word boolean queries, and is a weak ranking signal on long text.
- **Full-text search** gives stemming, stop-word handling, `websearch_to_tsquery` boolean parsing, and proper frequency/proximity ranking — this is what makes body/description search good, and it's pure Postgres (no API call, no cost).
- **Semantic search alone** is notably weak at exact-term recall (rare words, names, IDs, exact phrases) — dropping FTS in favor of embeddings-only would mean body content only gets matched "by vibes," a real regression for a notes app where you often remember an exact word/phrase you wrote.

**RRF weighting:** standard (unweighted) RRF — `score = Σ 1/(60 + rank)` per source, each source counted equally. This sidesteps score normalization entirely (trigram similarity is 0–1, `ts_rank_cd` is unbounded, cosine distance is 0–2 — combining raw scores would need per-source tuning; RRF only needs rank position). Start with equal weights; add a per-source multiplier later only if real usage shows results feel miscalibrated — that's a one-line change, not a re-architecture.

Notable constraint: the repo has **no AI SDK dependency today** — this is the first feature to call an external model API, introducing an `openai` dependency, an `OPENAI_API_KEY`, and a network call in the write path for the first time.

## Architecture

- **Trigram (`pg_trgm`)** — GIN index with `gin_trgm_ops` on `title`, using `similarity()`.
- **Full-text search** — a generated, stored `tsvector` column per table combining `title` (weight `A`) + `body`/`description` (weight `B`), GIN-indexed, queried with `websearch_to_tsquery` + `ts_rank_cd`.
- **Semantic (`pgvector`)** — a `vector(512)` embedding column per row (OpenAI `text-embedding-3-small`, truncated to 512 dims via the API's native Matryoshka `dimensions` param — cheaper storage/index with negligible quality loss), HNSW-indexed with `vector_cosine_ops`.
- **Fusion** — RRF computed per entity type in SQL; the two entity-type result sets (notes, tasks) are merged/sorted by RRF score in the server function before returning to the client. Two separate, symmetric SQL queries rather than one UNION query — notes and tasks don't share a shape (`markdown`/`body` vs. `description`/`columnId`), and RRF scores from the same `k=60` formula are directly comparable across the two queries, so merging in application code is simpler than forcing a single SQL shape.

## Step-by-Step Implementation

### Step 1: Enable Postgres Extensions
**Files:** new custom migration under `packages/www/drizzle/`

Generate an empty custom migration and fill it in:
```bash
cd packages/www
pnpm exec drizzle-kit generate --custom --name enable_search_extensions
```
```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS vector;
```
This must land before any schema migration that references `gin_trgm_ops` or the `vector` type.

---

### Step 2: Make PGlite (dev/test) Load the Same Extensions
**File:** `packages/www/src/db/index.ts`

`pg_trgm` ships in PGlite core at `@electric-sql/pglite/contrib/pg_trgm`. `vector` needs the separate `@electric-sql/pglite-pgvector` package (`pnpm add @electric-sql/pglite-pgvector`). Update `createPgliteDb` to construct the client with both:
```ts
import { pg_trgm } from '@electric-sql/pglite/contrib/pg_trgm'
import { vector } from '@electric-sql/pglite-pgvector'

const client = await PGlite.create(dataDir, { extensions: { pg_trgm, vector } })
```
(Both packages/extension entrypoints confirmed to exist during research — verify import paths still match at implementation time via https://pglite.dev/extensions/.)

---

### Step 3: Schema Changes
**Files:** `packages/www/src/db/schema.notes.ts`, `packages/www/src/db/schema.kanban.ts` (`tasksTable` only — boards/columns aren't searched)

- Add a `customType<{ data: string }>({ dataType: () => 'tsvector' })` helper (e.g. in `schema.notes.ts` or a shared `db/types.ts`) — Drizzle has no built-in `tsvector` column type.
- Add `searchVector` column: `.generatedAlwaysAs(sql\`setweight(to_tsvector('english', coalesce(title,'')), 'A') || setweight(to_tsvector('english', coalesce(body,'')), 'B')\`)` (swap `body` for `description` on tasks) — Postgres backfills this automatically for existing rows when the column is added to a populated table.
- Add `embedding: vector('embedding', { dimensions: 512 })`, nullable (populated async — see Step 9). Drizzle's `pg-core` exports a native `vector` column type already (confirmed present in the installed `drizzle-orm` version).
- Add indexes via the table's third-arg callback: GIN trigram index on `title` (`gin_trgm_ops`), GIN index on `searchVector`, HNSW index on `embedding` (`vector_cosine_ops`).

---

### Step 4: Generate + Review Migration
```bash
pnpm db:generate
```
Inspect the emitted SQL for correctness (generated-column expression, index operator classes), then commit.

---

### Step 5: Env Var + Dependency
**File:** `packages/www/src/env.ts`

Add `OPENAI_API_KEY: z.string()` to the `server` schema (per existing `@t3-oss/env-core` convention — do not read `process.env` directly). Add `openai` to `packages/www/package.json` dependencies.

---

### Step 6: Embedding Helper
**File:** new `packages/www/src/server/embeddings.ts`
```ts
export const embed = async (text: string): Promise<number[]> => {
	const res = await openai.embeddings.create({
		model: 'text-embedding-3-small',
		input: text,
		dimensions: 512,
	})
	return res.data[0].embedding
}
```

---

### Step 7: Wire Embedding Generation Into Writes
**Files:** `packages/www/src/server/notes.ts` (`createNote`, `updateNote`), `packages/www/src/server/tasks.ts` (`createTask`, `updateTask`)

After the insert/update, call `embed(title + '\n' + (body ?? description ?? ''))` and `UPDATE ... SET embedding = ...`. Wrap the embed call in `try/catch` — log and continue on failure rather than failing the save. Embedding is best-effort; the client already treats mutations as optimistic (UI updates in `onMutate` before `mutationFn` resolves, per the existing pattern in `hooks/notes.ts`/`hooks/tasks.ts`), so added latency here doesn't block perceived UX.

---

### Step 8: Search Server Function
**File:** new `packages/www/src/server/search.ts`, following the existing `createServerFn().middleware([withDb]).validator(...)` pattern used in `server/notes.ts`/`server/tasks.ts`

- `searchNotes(db, userId, query, queryEmbedding)` and `searchTasks(...)` — each a single raw SQL query (via drizzle `sql` template) with three CTEs (trigram/`similarity(title, query)`, FTS/`ts_rank_cd(search_vector, websearch_to_tsquery('english', query))`, semantic/`1 - (embedding <=> queryEmbedding)`), each `LIMIT 20`, fused via RRF, `LIMIT 20` final, scoped by `WHERE user_id = $userId`.
- Top-level `search` server fn: `requireSession()`, `embed(query)` once, run both queries in parallel via `Promise.all`, merge-sort by RRF score, return top ~20 tagged with `type: 'note' | 'task'` (tasks include `boardId` via a join to `columnsTable` so the client can build a navigation link).

---

### Step 9: Client Search Hook
**File:** new `packages/www/src/hooks/search.ts`, mirroring `notesQuery`/`useNote` conventions in `hooks/notes.ts`
```ts
export const searchQuery = (query: string) =>
	queryOptions({
		queryKey: ['search', query],
		queryFn: () => search({ data: { query } }),
		enabled: query.trim().length > 0,
	})
export const useSearch = (query: string) => useQuery(searchQuery(query))
```

---

### Step 10: Update `SearchDialog`
**File:** `packages/www/src/components/sidebar/search-dialog.tsx`

Replace `searchWorker.query(query).then(setResults)` with a debounced (~250ms) call into `useSearch`. Render a type badge (note/task) per result and route note results to `/notes/$noteId`, task results to `/boards/$boardId` (using the `boardId` returned in Step 8). Update placeholder text from "Search cards..." since it now covers notes too.

---

### Step 11: Remove Dead Client-Side Search
Delete `packages/www/src/lib/search.ts`, `packages/www/src/lib/search.worker.ts`. Remove `minisearch` and `comlink` from `package.json` (grep first to confirm `comlink` isn't used elsewhere in the codebase before removing).

---

### Step 12: Backfill Existing Rows
`searchVector` backfills automatically as part of the `ALTER TABLE ... ADD COLUMN ... GENERATED ALWAYS AS (...) STORED` migration. `embedding` does not — write a one-off script (or temporary server fn) that selects all notes/tasks with `embedding IS NULL` and populates them via `embed()`, batched to respect OpenAI rate limits. Run once against prod after deploying.

## Verification

- `pnpm db:generate` then apply against a local Postgres (`pnpm db:migrate`) and confirm PGlite dev boots cleanly with both extensions loaded (`pnpm dev`, watch for extension-load errors).
- Add a vitest integration test against the PGlite test DB: seed notes/tasks with a deliberate typo case, a keyword-only case, and a semantic-only case (query text shares no words with the target), assert each surfaces in `search()` results.
- Manually exercise `Mod+K` in the browser: typo in a title, a phrase from a note body, and a semantic query with no literal overlap — confirm all three return relevant results and clicking navigates correctly for both notes and tasks.
- Confirm a normal note/task save still succeeds (and isn't perceptibly slower) with `OPENAI_API_KEY` temporarily unset/invalid, to verify the try/catch in Step 7 actually degrades gracefully.

## References

- [Supabase: Hybrid search](https://supabase.com/docs/guides/ai/hybrid-search) — canonical schema + RRF SQL function walkthrough
- [ParadeDB: Hybrid Search in PostgreSQL — The Missing Manual](https://www.paradedb.com/blog/hybrid-search-in-postgresql-the-missing-manual)
- [Jonathan Katz: Hybrid search with PostgreSQL and pgvector](https://jkatz05.com/post/postgres/hybrid-search-postgres-pgvector/)
- [Building Hybrid Search for RAG: pgvector + FTS + RRF](https://dev.to/lpossamai/building-hybrid-search-for-rag-combining-pgvector-and-full-text-search-with-reciprocal-rank-fusion-6nk)
- [You Don't Need a Vector DB: Ranking hybrid search in Postgres](https://www.andreacasarin.com/2026/05/28/ranking-hybrid-search-in-postgres/)
- [Postgres full-text search docs](https://www.postgresql.org/docs/current/textsearch.html)
- [pg_trgm docs](https://www.postgresql.org/docs/current/pgtrgm.html)
- [pgvector README (HNSW/IVFFlat, index ops)](https://github.com/pgvector/pgvector)
- [HNSW vs IVFFlat: which to choose](https://dev.to/philip_mcclarence_2ef9475/ivfflat-vs-hnsw-in-pgvector-which-index-should-you-use-305p)
- [Supabase: Fewer dimensions are better (pgvector)](https://supabase.com/blog/fewer-dimensions-are-better-pgvector)
- [PGlite extensions](https://pglite.dev/extensions/)
- [OpenAI: Vector embeddings guide](https://developers.openai.com/api/docs/guides/embeddings) — `dimensions` param, `text-embedding-3-small` pricing/limits
