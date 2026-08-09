-- Convert position from integer to text with fractional-indexing format.
-- Existing integer positions (1, 2, 3, ...) are converted to padded strings (a00000001, a00000002, ...)
-- maintaining lexicographic ordering. New positions will use fractional-indexing's format (a0, a1, a0V, etc).
ALTER TABLE "tasks" ALTER COLUMN "position" SET DATA TYPE text USING
  'a' || LPAD(position::text, 8, '0');