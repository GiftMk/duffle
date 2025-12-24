import { boardSchema, columnSchema, taskSchema } from "@/models";
import { createCollection } from "@tanstack/react-db";
import { localStorageCollectionOptions } from "@tanstack/react-db";

enum CollectionKeys {
  boards = "boards",
  columns = "columns",
  tasks = "tasks",
}

export const boardCollection = createCollection(
  localStorageCollectionOptions({
    id: CollectionKeys.boards,
    storageKey: CollectionKeys.boards,
    getKey: (item) => item.id,
    schema: boardSchema,
  }),
);

export const columnCollection = createCollection(
  localStorageCollectionOptions({
    id: CollectionKeys.columns,
    storageKey: CollectionKeys.columns,
    getKey: (item) => item.id,
    schema: columnSchema,
  }),
);

export const taskCollection = createCollection(
  localStorageCollectionOptions({
    id: CollectionKeys.tasks,
    storageKey: CollectionKeys.tasks,
    getKey: (item) => item.id,
    schema: taskSchema,
  }),
);
