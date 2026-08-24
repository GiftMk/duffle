import { prosePluginsCtx, SchemaReady } from '@milkdown/kit/core'
import type { MilkdownPlugin } from '@milkdown/kit/ctx'
import { inlineCodeSchema } from '@milkdown/kit/preset/commonmark'
import createCodemarkPlugins from 'prosemirror-codemark'
import 'prosemirror-codemark/dist/codemark.css'

export const codemark: MilkdownPlugin = (ctx) => async () => {
	await ctx.wait(SchemaReady)

	const plugins = createCodemarkPlugins({
		markType: inlineCodeSchema.type(ctx),
	})

	ctx.update(prosePluginsCtx, (prev) => [...prev, ...plugins])

	return () => {
		ctx.update(prosePluginsCtx, (prev) =>
			prev.filter((plugin) => !plugins.includes(plugin)),
		)
	}
}
