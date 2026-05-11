import { catppuccinLatte } from '@catppuccin/codemirror'
import type { LanguageDescription } from '@codemirror/language'
import { languages } from '@codemirror/language-data'
import { Compartment } from '@codemirror/state'
import { drawSelection } from '@codemirror/view'
import { codeBlockSchema } from '@milkdown/kit/preset/commonmark'
import type { NodeViewConstructor } from '@milkdown/prose/view'
import { $ctx, $view } from '@milkdown/utils'
import { basicSetup } from 'codemirror'
import { CodeBlockView } from './code-block-view'
import { CodeMirrorBridge } from './code-mirror-bridge'
import { KeymapExtension } from './keymap-extension'
import { LanguageCollection } from './language-collection'
import { LazyCodeMirror } from './lazy-code-mirror'
import { ReactDomAdapter } from './react-dom-adapter'

type CodeBlockContext = {
	languages: LanguageDescription[]
}

export const defaultCodeBlockCtx = { languages }

export const codeBlockCtx = $ctx<CodeBlockContext, 'codeBlockContext'>(
	defaultCodeBlockCtx,
	'codeBlockContext',
)

const baseExtensions = [basicSetup, drawSelection(), catppuccinLatte]

export const codeBlock = $view(
	codeBlockSchema.node,
	(ctx): NodeViewConstructor => {
		const { languages: languageDefinitions } = ctx.get(codeBlockCtx.key)

		return (node, view, getPosition) => {
			const codeMirror = new LazyCodeMirror()
			const languages = new LanguageCollection(languageDefinitions)
			const bridge = new CodeMirrorBridge({
				node,
				view,
				getPosition,
				languages,
				codeMirror,
			})
			const keymapExtension = new KeymapExtension({
				view,
				node,
				getPosition,
				codeMirror,
			})
			const domAdapter = new ReactDomAdapter({
				codeMirror,
				languages,
				bridge,
			})
			const dynamicExtensions = new Compartment()
			const codeBlockView = new CodeBlockView({
				node,
				view,
				getPosition,
				bridge,
				dom: domAdapter.root,
				extensions: dynamicExtensions.of([]),
			})

			codeMirror.set(codeBlockView.codeMirror)
			codeBlockView.codeMirror.dispatch({
				effects: dynamicExtensions.reconfigure([
					...baseExtensions,
					keymapExtension,
				]),
			})
			domAdapter.render()
			bridge.pullLanguage()

			return codeBlockView
		}
	},
)
