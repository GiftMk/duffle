import { catppuccinLatte } from '@catppuccin/codemirror'
import {
	bracketMatching,
	defaultHighlightStyle,
	foldGutter,
	foldKeymap,
	indentOnInput,
	syntaxHighlighting,
	type LanguageDescription,
} from '@codemirror/language'
import { languages } from '@codemirror/language-data'
import { Compartment, EditorState, type Extension } from '@codemirror/state'
import {
	crosshairCursor,
	drawSelection,
	dropCursor,
	highlightActiveLine,
	highlightActiveLineGutter,
	highlightSpecialChars,
	keymap,
	lineNumbers,
	rectangularSelection,
} from '@codemirror/view'
import { codeBlockSchema } from '@milkdown/kit/preset/commonmark'
import type { NodeViewConstructor } from '@milkdown/prose/view'
import { $ctx, $view } from '@milkdown/utils'
import { type EditorView as CodeMirror } from 'codemirror'
import { ReactDomAdapter } from './components/react-dom-adapter'
import { CodeBlockView } from './lib/code-block-view'
import { CodeMirrorBridge } from './lib/code-mirror-bridge'
import { KeymapExtension } from './lib/keymap-extension'
import { LanguageRepository } from './lib/language-repository'
import { Lazy } from './lib/lazy'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { highlightSelectionMatches } from '@codemirror/search'
import {
	autocompletion,
	completionKeymap,
	closeBrackets,
	closeBracketsKeymap,
} from '@codemirror/autocomplete'
import { lintKeymap } from '@codemirror/lint'

type CodeBlockContext = {
	languages: LanguageDescription[]
}

export const defaultCodeBlockCtx = { languages }

export const codeBlockCtx = $ctx<CodeBlockContext, 'codeBlockContext'>(
	defaultCodeBlockCtx,
	'codeBlockContext',
)

export const basicSetup: Extension = (() => [
	lineNumbers(),
	highlightActiveLineGutter(),
	highlightSpecialChars(),
	history(),
	foldGutter(),
	drawSelection(),
	dropCursor(),
	EditorState.allowMultipleSelections.of(true),
	indentOnInput(),
	syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
	bracketMatching(),
	closeBrackets(),
	autocompletion(),
	rectangularSelection(),
	crosshairCursor(),
	highlightActiveLine(),
	highlightSelectionMatches(),
	keymap.of([
		...closeBracketsKeymap,
		...historyKeymap,
		...foldKeymap,
		...completionKeymap,
		...lintKeymap,
	]),
])()

const baseExtensions = [basicSetup, drawSelection(), catppuccinLatte]

export const codeBlockView = $view(
	codeBlockSchema.node,
	(ctx): NodeViewConstructor => {
		const languageRepository = new LanguageRepository(
			ctx.get(codeBlockCtx.key).languages,
		)

		return (node, view, getPos) => {
			const codeMirror = new Lazy<CodeMirror>()
			const languageInput = new Lazy<HTMLInputElement>()
			const dynamicExtensions = new Compartment()
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
				languageInput,
			})
			const domAdapter = new ReactDomAdapter({
				codeMirror,
				languageRepository,
				bridge,
				languageInput,
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
