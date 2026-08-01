import { Dexie, type EntityTable } from 'dexie'
import type { BoardEntity } from './boards-store'
import type { ColumnEntity } from './columns-store'
import type { TaskEntity } from './tasks-store'

export const idb = new Dexie('duffle-db') as Dexie & {
	boards: EntityTable<BoardEntity, 'id'>
	columns: EntityTable<ColumnEntity, 'id'>
	tasks: EntityTable<TaskEntity, 'id'>
}

idb.version(1).stores({
	boards: 'id, title, columns',
	columns: 'id, title, tasks',
	tasks: 'id, title, description',
})

idb.version(2).stores({
	boards: 'id, title, updatedAt',
	columns: 'id, title',
	tasks: 'id, title',
})
