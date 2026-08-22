ALTER TABLE "kanban"."columns" DROP CONSTRAINT "columns_board_id_boards_id_fkey";--> statement-breakpoint
ALTER TABLE "kanban"."tasks" DROP CONSTRAINT "tasks_column_id_columns_id_fkey";--> statement-breakpoint
DROP TABLE "kanban"."boards";--> statement-breakpoint
DROP TABLE "kanban"."columns";--> statement-breakpoint
DROP TABLE "kanban"."tasks";--> statement-breakpoint
DROP SCHEMA "kanban";
