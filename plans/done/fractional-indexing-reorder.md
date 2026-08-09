# Fractional Indexing for Task Reordering (String-based)

Optimize `useMoveTask` to reduce DB writes from O(n) to O(1) per drag-and-drop move by switching from integer positions with full-column reindex to string-based fractional indexing using the `fractional-indexing` library.

**Key benefit:** string-based ranks (like `"a0"`, `"a1V"`) can always generate a new value between any two existing values, so no rebalance logic needed. Every move is guaranteed O(1) DB writes.

## Step-by-Step Implementation

### Step 1: Install Dependency
**File:** `packages/www/package.json`

Add the `fractional-indexing` library (zero dependencies, ~1KB):
```bash
cd packages/www
npm install fractional-indexing
# or
pnpm add fractional-indexing
```

---

### Step 2: Update Database Schema
**File:** `packages/www/src/db/schema.kanban.ts`

Change the `position` column type from integer to text:
- Line 39: `position: text().notNull()` (for `tasksTable`)
- Keep `columnsTable.position` as integer — no column-reorder feature exists yet

**Drizzle Migration:**
```bash
cd packages/www
drizzle-kit generate
# Review the generated migration, then apply it:
npm run db:push  # or your DB push command
```

Verify: run `SELECT id, columnId, position FROM tasks LIMIT 5;` in your DB client — `position` should now be `text` with values like `"a0"`, `"a1"`, etc.

---

### Step 3: Update Schemas (if needed)
**File:** `packages/www/src/lib/schemas.ts`

The `position: z.number()` line works fine as-is — strings are numbers in Zod's type system via coercion, or you can explicitly update it to:
```ts
position: z.string(),
```

Either works, but being explicit is clearer. Check the current schema and update if desired.

---

### Step 4: Add Position Helper Functions
**File:** `packages/www/src/hooks/tasks.ts`

Add this import at the top:
```ts
import { generateKeyBetween } from 'fractional-indexing'
```

Then add a simple helper:
```ts
const getPositionBetween = (prev?: string | null, next?: string | null): string => {
	return generateKeyBetween(prev ?? null, next ?? null)
}
```

This is a thin wrapper around the library function; it always returns a valid string position between `prev` and `next`, regardless of how many times you've inserted between them.

---

### Step 5: Refactor Task Grouping
**File:** `packages/www/src/hooks/tasks.ts`

Update the `getSortedTasks` function (lines 25–28) to sort by string position (lexicographically):

```ts
const getSortedTasks = (columnId: string, tasks: TaskEntity[]) =>
	tasks
		.filter((task) => task.columnId === columnId)
		.sort((a, b) => (a.position < b.position ? -1 : a.position > b.position ? 1 : 0))
```

The difference from integer sort: use string comparison (`<`, `>`) instead of subtraction. This ensures tasks remain sorted by their lexicographic rank, which matches Postgres's default text ordering.

Alternatively, create `getTasksByColumn` to batch the grouping (optional optimization, since this is still called only once per move):

```ts
const getTasksByColumn = (
	tasks: TaskEntity[],
	columnIds: string[],
): Map<string, TaskEntity[]> => {
	const result = new Map<string, TaskEntity[]>()
	
	for (const columnId of columnIds) {
		const sorted = tasks
			.filter((task) => task.columnId === columnId)
			.sort((a, b) => (a.position < b.position ? -1 : a.position > b.position ? 1 : 0))
		result.set(columnId, sorted)
	}
	
	return result
}
```

And update `useTasks` to use it (line 30–33):

```ts
export const useTasks = (columnId: string) => {
	const { data } = useSuspenseQuery(tasksQuery)
	return getTasksByColumn(data, [columnId]).get(columnId) ?? []
}
```

---

### Step 6: Refactor `useAddTask`
**File:** `packages/www/src/hooks/tasks.ts`

Update line 119 to append using `generateKeyBetween`:

```ts
const lastTask = getSortedTasks(columnId, tasks).at(-1)
const position = getPositionBetween(lastTask?.position, null)
```

This generates a rank after the last task, or `"a0"` if the column is empty.

---

### Step 7: Rewrite `useMoveTask`
**File:** `packages/www/src/hooks/tasks.ts`

Replace the entire `useMoveTask` hook (lines 137–195) with the new fractional-indexing logic. Remove the old `reposition` function entirely:

```ts
export const useMoveTask = () => {
	const queryClient = useQueryClient()

	const { mutate } = useMutation({
		mutationFn: (tasks: TaskEntity[]) =>
			Promise.all(tasks.map((task) => updateTaskFn({ data: task }))),
		onMutate: async (updatedTasks) => {
			await queryClient.cancelQueries({ queryKey: tasksQuery.queryKey })
			const previous = queryClient.getQueryData<TaskEntity[]>(
				tasksQuery.queryKey,
			)
			queryClient.setQueryData<TaskEntity[]>(tasksQuery.queryKey, (old) =>
				upsertItems(old, updatedTasks),
			)
			return { previous }
		},
		onError: (_err, _tasks, context) => {
			queryClient.setQueryData(tasksQuery.queryKey, context?.previous)
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: tasksQuery.queryKey })
		},
	})

	return (source: DndTarget, destination: DndTarget) => {
		const tasks =
			queryClient.getQueryData<TaskEntity[]>(tasksQuery.queryKey) ?? []
		
		// Load and sort source and destination columns
		const sourceTasks = getSortedTasks(source.columnId, tasks)
		const sourceTask = sourceTasks[source.position]

		if (!sourceTask) {
			throw new Error('Failed to move task, could not find source task.')
		}

		const timestamp = utcNow()

		// Filter out source task from destination to match drop-index semantics
		const destinationTasks =
			source.columnId === destination.columnId
				? sourceTasks.filter((t) => t.id !== sourceTask.id)
				: getSortedTasks(destination.columnId, tasks)

		const prevTask = destinationTasks[destination.position - 1]
		const nextTask = destinationTasks[destination.position]

		// Compute new position as a string rank between neighbors
		const newPosition = getPositionBetween(
			prevTask?.position ?? null,
			nextTask?.position ?? null,
		)

		// Single task to persist: the moved task with its new position
		const toPersist: TaskEntity[] = [
			{
				...sourceTask,
				columnId: destination.columnId,
				position: newPosition,
				updatedAt: timestamp,
			},
		]

		mutate(toPersist)
	}
}
```

**Key changes:**
- No `reposition` function needed — we only ever update one task per move
- `getPositionBetween` handles all cases: both neighbors exist, one exists, or neither (empty column)
- `generateKeyBetween` from the library handles arbitrarily-deep nesting; no precision limit to worry about
- `toPersist` is always exactly 1 element — guaranteed O(1) DB writes
- Logic is simpler and more robust than the float-based approach with collision checking

---

## Verification Checklist

- [ ] Install `fractional-indexing` successfully; `npm list fractional-indexing` shows it in `packages/www`
- [ ] Migration runs successfully; `position` column is now `text`
- [ ] App starts with no errors; existing tasks still display and sort correctly
- [ ] Drag a task within the same column; confirm it moves and persists after reload
- [ ] Drag a task between columns; confirm it moves and persists after reload
- [ ] Open browser network tab; verify exactly **1** `updateTask` call fires per drag (every time, not just common case)
- [ ] Inspect a task in the DB; position value looks like `"a0"`, `"a1"`, `"a0V"`, etc. (lexicographically sortable strings)
- [ ] Drag the same task into the same gap 100+ times; verify it still generates valid positions and tasks remain correctly ordered after reload
- [ ] No regressions: adding tasks, deleting tasks, renaming boards/columns all still work

---

## References & Algorithm Details

The `fractional-indexing` library implements the algorithm used by Figma, Linear, and other collaborative apps:

- [Figma: Realtime Editing of Ordered Sequences](https://www.figma.com/blog/realtime-editing-of-ordered-sequences/)
- [Steve Ruiz: Reordering with Fractional Indices](https://www.steveruiz.me/posts/reordering-fractional-indices)
- [Yasoob Khalid: How to Efficiently Reorder Items in a Database](https://yasoob.me/posts/how-to-efficiently-reorder-or-rerank-items-in-database/)
- [GitHub: fractional-indexing](https://github.com/sqliteai/fractional-indexing)

**How it works:** `generateKeyBetween("a0", "a1")` returns `"a0V"` (roughly "0.5" in base62). `generateKeyBetween("a0", "a0V")` returns `"a0H"` ("0.25"), and so on. The library uses base62 encoding (`0-9A-Za-z`) and string comparison, which means:
- JS string comparison (`<`, `>`) works correctly for ordering
- Postgres `text` column comparison also works correctly (same collation)
- No float precision limit — you can insert into the same gap indefinitely
- Positions are opaque but sortable (e.g. `"a0"`, `"a1V"`, `"Zz"` — not human-readable, but deterministic and efficient)
