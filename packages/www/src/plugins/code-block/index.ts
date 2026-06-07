import { catppuccinLatte } from '@catppuccin/codemirror'
import type { LanguageDescription } from '@codemirror/language'
import { languages } from '@codemirror/language-data'
import { Compartment } from '@codemirror/state'
import { drawSelection } from '@codemirror/view'
import { codeBlockSchema } from '@milkdown/kit/preset/commonmark'
import type { NodeViewConstructor } from '@milkdown/prose/view'
import { $ctx, $view } from '@milkdown/utils'
import { basicSetup, type EditorView as CodeMirror } from 'codemirror'
import { ReactDomAdapter } from './components/react-dom-adapter'
import { CodeBlockView } from './lib/code-block-view'
import { CodeMirrorBridge } from './lib/code-mirror-bridge'
import { KeymapExtension } from './lib/keymap-extension'
import { LanguageRepository } from './lib/language-repository'
import { Lazy } from './lib/lazy'

type CodeBlockContext = {
	languages: LanguageDescription[]
}

export const defaultCodeBlockCtx = { languages }

export const codeBlockCtx = $ctx<CodeBlockContext, 'codeBlockContext'>(
	defaultCodeBlockCtx,
	'codeBlockContext',
)

const baseExtensions = [basicSetup, drawSelection(), catppuccinLatte]

export const codeBlockView = $view(
	codeBlockSchema.node,
	(ctx): NodeViewConstructor => {
		const languageRepository = new LanguageRepository(
			ctx.get(codeBlockCtx.key).languages,
		)
		const codeMirror = new Lazy<CodeMirror>()
		const dynamicExtensions = new Compartment()

		return (node, view, getPos) => {
			const bridge = new CodeMirrorBridge({
				node,
				view,
				getPos,
				languageRepository,
				codeMirror,
			})
			const keymapExtension = new KeymapExtension({
				view,
				node,
				getPos,
				codeMirror,
			})
			const domAdapter = new ReactDomAdapter({
				codeMirror,
				languageRepository,
				bridge,
			})
			const codeBlockView = new CodeBlockView({
				node,
				view,
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
			bridge.readLanguage()

			return codeBlockView
		}
	},
)

export const codeBlock = [codeBlockCtx, codeBlockView]
