ALTER TABLE "auth"."users" ADD COLUMN "is_anonymous" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE INDEX "notes_title_idx" ON "notes"."notes" USING gin ("title" gin_trgm_ops);