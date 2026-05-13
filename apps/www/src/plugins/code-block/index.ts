import { catppuccinLatte } from '@catppuccin/codemirror'
import type { LanguageDescription } from '@codemirror/language'
import { languages } from '@codemirror/language-data'
import { Compartment } from '@codemirror/state'
import { drawSelection } from '@codemirror/view'
import { codeBlockSchema } from '@milkdown/kit/preset/commonmark'
import type { NodeViewConstructor } from '@milkdown/prose/view'
import { $ctx, $view } from '@milkdown/utils'
import { createAtom } from '@xstate/store'
import type { EditorView as CodeMirror } from 'codemirror'
import { basicSetup } from 'codemirror'
import { ReactDomAdapter } from './components/react-dom-adapter'
import { CodeBlockView } from './lib/code-block-view'
import { CodeMirrorBridge } from './lib/code-mirror-bridge'
import { KeymapExtension } from './lib/keymap-extension'
import {
	LanguageCollection,
	type LanguageRecord,
} from './lib/language-collection'

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
		const languages = new LanguageCollection(
			ctx.get(codeBlockCtx.key).languages,
		)
		const language = createAtom<LanguageRecord | null>(null)
		const codeMirror = createAtom<CodeMirror | null>(null)
		const dynamicExtensions = new Compartment()

		return (node, view, getPosition) => {
			const bridge = new CodeMirrorBridge({
				node,
				view,
				getPosition,
				languages,
				language,
				codeMirror,
			})
			const keymapExtension = new KeymapExtension({
				view,
				node,
				getPosition,
				codeMirror,
			})
			const domAdapter = new ReactDomAdapter({
				codeMirrorAtom: codeMirror,
				languageAtom: language,
				languages,
				bridge,
			})
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
			bridge.readLanguage()

			return codeBlockView
		}
	},
)
