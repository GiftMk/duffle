ALTER TABLE "auth"."users" ADD COLUMN "is_anonymous" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE INDEX "notes_title_idx" ON "notes"."notes" USING gin ("title" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "notes_body_search_idx" ON "notes"."notes" USING gin (to_tsvector('english', "body"));