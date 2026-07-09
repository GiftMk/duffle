import type { Ctx } from '@milkdown/kit/ctx'
import {
	addBlockTypeCommand,
	blockquoteSchema,
	bulletListSchema,
	createCodeBlockCommand,
	headingSchema,
	hrSchema,
	listItemSchema,
	orderedListSchema,
	setBlockTypeCommand,
	wrapInBlockTypeCommand,
} from '@milkdown/kit/preset/commonmark'
import { callCommand } from '@milkdown/kit/utils'

export type SlashCommand = {
	value: string
	label: string
	run: (ctx: Ctx) => void
}

const HEADINGS: SlashCommand[] = [
	{
		value: 'h1',
		label: 'Heading 1',
		run: (ctx) => {
			callCommand(setBlockTypeCommand.key, {
				nodeType: headingSchema.type(ctx),
				attrs: {
					level: 1,
				},
			})(ctx)
		},
	},
	{
		value: 'h2',
		label: 'Heading 2',
		run: (ctx) => {
			callCommand(setBlockTypeCommand.key, {
				nodeType: headingSchema.type(ctx),
				attrs: {
					level: 2,
				},
			})(ctx)
		},
	},
	{
		value: 'h3',
		label: 'Heading 3',
		run: (ctx) => {
			callCommand(setBlockTypeCommand.key, {
				nodeType: headingSchema.type(ctx),
				attrs: {
					level: 3,
				},
			})(ctx)
		},
	},
	{
		value: 'h4',
		label: 'Heading 4',
		run: (ctx) => {
			callCommand(setBlockTypeCommand.key, {
				nodeType: headingSchema.type(ctx),
				attrs: {
					level: 4,
				},
			})(ctx)
		},
	},
	{
		value: 'h5',
		label: 'Heading 5',
		run: (ctx) => {
			callCommand(setBlockTypeCommand.key, {
				nodeType: headingSchema.type(ctx),
				attrs: {
					level: 5,
				},
			})(ctx)
		},
	},
	{
		value: 'h6',
		label: 'Heading 6',
		run: (ctx) => {
			callCommand(setBlockTypeCommand.key, {
				nodeType: headingSchema.type(ctx),
				attrs: {
					level: 6,
				},
			})(ctx)
		},
	},
]

const LISTS: SlashCommand[] = [
	{
		value: 'bullet-list',
		label: 'Bullet List',
		run: (ctx) => {
			callCommand(wrapInBlockTypeCommand.key, {
				nodeType: bulletListSchema.type(ctx),
			})(ctx)
		},
	},
	{
		value: 'ordered-list',
		label: 'Ordered List',
		run: (ctx) => {
			callCommand(wrapInBlockTypeCommand.key, {
				nodeType: orderedListSchema.type(ctx),
			})(ctx)
		},
	},
	{
		value: 'task-list',
		label: 'Task List',
		run: (ctx) => {
			callCommand(wrapInBlockTypeCommand.key, {
				nodeType: listItemSchema.type(ctx),
				attrs: {
					checked: false,
				},
			})(ctx)
		},
	},
]

export const DEFAULT_COMMANDS: SlashCommand[] = [
	...HEADINGS,
	...LISTS,
	{
		value: 'code-block',
		label: 'Code Block',
		run: (ctx) => {
			callCommand(createCodeBlockCommand.key)(ctx)
		},
	},
	{
		value: 'quote',
		label: 'Quote',
		run: (ctx) => {
			callCommand(wrapInBlockTypeCommand.key, {
				nodeType: blockquoteSchema.type(ctx),
			})(ctx)
		},
	},
	{
		value: 'divider',
		label: 'Divider',
		run: (ctx) => {
			callCommand(addBlockTypeCommand.key, {
				nodeType: hrSchema.type(ctx),
			})(ctx)
		},
	},
]
