ALTER TABLE "tasks" ADD COLUMN "search_vector" tsvector GENERATED ALWAYS AS (setweight(to_tsvector('english', coalesce(title, '')), 'A') || setweight(to_tsvector('english', coalesce(description, '')), 'B')) STORED;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "embedding" vector(512);--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "search_vector" tsvector GENERATED ALWAYS AS (setweight(to_tsvector('english', coalesce(title, '')), 'A') || setweight(to_tsvector('english', coalesce(body, '')), 'B')) STORED;--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "embedding" vector(512);--> statement-breakpoint
CREATE INDEX "tasks_title_trgm_idx" ON "tasks" USING gin ("title" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "tasks_search_vector_idx" ON "tasks" USING gin ("search_vector");--> statement-breakpoint
CREATE INDEX "tasks_embedding_hnsw_idx" ON "tasks" USING hnsw ("embedding" vector_cosine_ops) WHERE embedding IS NOT NULL;--> statement-breakpoint
CREATE INDEX "notes_title_trgm_idx" ON "notes" USING gin ("title" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "notes_search_vector_idx" ON "notes" USING gin ("search_vector");--> statement-breakpoint
CREATE INDEX "notes_embedding_hnsw_idx" ON "notes" USING hnsw ("embedding" vector_cosine_ops) WHERE embedding IS NOT NULL;