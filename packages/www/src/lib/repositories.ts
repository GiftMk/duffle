import type z from 'zod'
import {
	createBoard,
	deleteBoard,
	getBoards,
	updateBoard,
} from '@/server/boards'
import {
	createColumn,
	deleteColumn,
	getColumns,
	updateColumn,
} from '@/server/columns'
import { createTask, deleteTask, getTasks, updateTask } from '@/server/tasks'
import { isAnonymous } from './auth'
import {
	type BoardEntity,
	boardSchema,
	type ColumnEntity,
	columnSchema,
	type TaskEntity,
	taskSchema,
} from './schemas'
import { createSafeStorage, type SafeStorage } from './utils'

export class LocalEntityStorage<T extends { id: string }> {
	private readonly storage: SafeStorage<T[]>

	constructor(key: string, schema: z.ZodType<T>) {
		this.storage = createSafeStorage(localStorage, key, schema.array())
	}

	getAll(): T[] {
		const items = this.storage.get()
		return items ?? []
	}

	getById(id: string): T | undefined {
		return this.getAll().find((item) => item.id === id)
	}

	add(item: T) {
		const items = this.getAll()
		items.push(item)

		this.storage.set(items)
	}

	update(item: T) {
		const items = this.getAll()
		const index = items.findIndex(({ id }) => id === item.id)
		if (index === -1) {
			return
		}

		items.splice(index, 1, item)
		this.storage.set(items)
	}

	delete(id: string) {
		const items = this.getAll()
		const index = items.findIndex((item) => item.id === id)
		if (index === -1) {
			return
		}

		items.splice(index, 1)
		this.storage.set(items)
	}
}

abstract class CrudRepository<T extends { id: string }> {
	private readonly storage: LocalEntityStorage<T>

	constructor(storage: LocalEntityStorage<T>) {
		this.storage = storage
	}

	async getAll() {
		if (await isAnonymous()) {
			return this.storage.getAll()
		}

		return await this.getAllAsync()
	}

	async add(entity: T) {
		if (await isAnonymous()) {
			console.log('is anonymous adding', entity)
			this.storage.add(entity)
			return
		}

		await this.addAsync(entity)
	}

	async update(entity: T) {
		if (await isAnonymous()) {
			this.storage.update(entity)
			return
		}

		await this.updateAsync(entity)
	}

	async delete(id: string) {
		if (await isAnonymous()) {
			this.storage.delete(id)
			return
		}

		await this.deleteAsync(id)
	}

	protected abstract getAllAsync(): Promise<T[]>
	protected abstract addAsync(entity: T): Promise<void>
	protected abstract updateAsync(entity: T): Promise<void>
	protected abstract deleteAsync(id: string): Promise<void>
}

export class BoardRepository extends CrudRepository<BoardEntity> {
	protected getAllAsync(): Promise<BoardEntity[]> {
		return getBoards()
	}

	override async delete(id: string): Promise<void> {
		await super.delete(id)
	}

	protected async addAsync(entity: BoardEntity): Promise<void> {
		await createBoard({ data: entity })
	}
	protected async updateAsync(entity: BoardEntity): Promise<void> {
		await updateBoard({ data: entity })
	}
	protected async deleteAsync(id: string): Promise<void> {
		await deleteBoard({ data: { id } })
	}
}

export class ColumnRepository extends CrudRepository<ColumnEntity> {
	protected getAllAsync(): Promise<ColumnEntity[]> {
		return getColumns()
	}
	protected async addAsync(entity: ColumnEntity): Promise<void> {
		await createColumn({ data: entity })
	}
	protected async updateAsync(entity: ColumnEntity): Promise<void> {
		await updateColumn({ data: entity })
	}
	protected async deleteAsync(id: string): Promise<void> {
		await deleteColumn({ data: { id } })
	}
}

export class TaskRepository extends CrudRepository<TaskEntity> {
	protected getAllAsync(): Promise<TaskEntity[]> {
		return getTasks()
	}
	protected async addAsync(entity: TaskEntity): Promise<void> {
		await createTask({ data: entity })
	}
	protected async updateAsync(entity: TaskEntity): Promise<void> {
		await updateTask({ data: entity })
	}
	protected async deleteAsync(id: string): Promise<void> {
		await deleteTask({ data: { id } })
	}
}

export const boardRepository = new BoardRepository(
	new LocalEntityStorage('boards', boardSchema),
)
export const columnRepository = new ColumnRepository(
	new LocalEntityStorage('columns', columnSchema),
)
export const taskRepository = new TaskRepository(
	new LocalEntityStorage('tasks', taskSchema),
)
