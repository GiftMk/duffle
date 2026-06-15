CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY NOT NULL,
	"markdown" text NOT NULL,
	"text" text NOT NULL,
	"search_vector" "tsvector" GENERATED ALWAYS AS (to_tsvector('english', "documents"."text")) STORED,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE INDEX "documents_text_fts" ON "documents" USING gin ("search_vector");