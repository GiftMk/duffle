import { catppuccinLatte } from '@catppuccin/codemirror'
import type { LanguageDescription } from '@codemirror/language'
import { languages } from '@codemirror/language-data'
import { Compartment } from '@codemirror/state'
import { drawSelection } from '@codemirror/view'
import { codeBlockSchema } from '@milkdown/kit/preset/commonmark'
import type { NodeViewConstructor } from '@milkdown/prose/view'
import { $ctx, $view } from '@milkdown/utils'
import { createAtom } from '@tanstack/react-store'
import type { EditorView as CodeMirror } from 'codemirror'
import { basicSetup } from 'codemirror'
import { ReactDomAdapter } from './components/react-dom-adapter'
import { CodeBlockView } from './lib/code-block-view'
import { CodeMirrorBridge } from './lib/code-mirror-bridge'
import { KeymapExtension } from './lib/keymap-extension'
import {
	type LanguageRecord,
	LanguageRepository,
} from './lib/language-repository'

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
		const languageAtom = createAtom<LanguageRecord | null>(null)
		const codeMirrorAtom = createAtom<CodeMirror | null>(null)
		const dynamicExtensions = new Compartment()

		return (node, view, getPos) => {
			const bridge = new CodeMirrorBridge({
				node,
				view,
				getPos,
				languageRepository,
				languageAtom,
				codeMirrorAtom,
			})
			const keymapExtension = new KeymapExtension({
				view,
				node,
				getPos,
				codeMirrorAtom,
			})
			const domAdapter = new ReactDomAdapter({
				codeMirrorAtom,
				languageAtom,
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

			codeMirrorAtom.set(codeBlockView.codeMirror)
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
