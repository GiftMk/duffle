import { catppuccinLatte } from '@catppuccin/codemirror'
import {
	autocompletion,
	closeBrackets,
	closeBracketsKeymap,
	completionKeymap,
} from '@codemirror/autocomplete'
import { history, historyKeymap } from '@codemirror/commands'
import {
	bracketMatching,
	defaultHighlightStyle,
	foldGutter,
	foldKeymap,
	indentOnInput,
	type LanguageDescription,
	syntaxHighlighting,
} from '@codemirror/language'
import { languages } from '@codemirror/language-data'
import { lintKeymap } from '@codemirror/lint'
import { highlightSelectionMatches } from '@codemirror/search'
import { EditorState, type Extension } from '@codemirror/state'
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
import type { Node } from '@milkdown/prose/model'
import type { NodeViewConstructor } from '@milkdown/prose/view'
import { $ctx, $view } from '@milkdown/utils'
import type { EditorView as CodeMirror } from 'codemirror'
import { CodeBlockView } from './code-block-view'
import { CodeMirrorBridge } from './code-mirror-bridge'
import { ReactDomAdapter } from './components/react-dom-adapter'
import { KeymapExtension } from './keymap-extension'
import { LanguageRepository } from './language-repository'
import { Reference } from './reference'

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

		return (_node, view, getPos) => {
			const codeMirror = new Reference<CodeMirror | null>(null)
			const languageInput = new Reference<HTMLInputElement | null>(null)
			const node = new Reference<Node>(_node)
			const state = {
				node,
				view,
				getPos,
			}

			const bridge = new CodeMirrorBridge({
				...state,
				languageRepository,
				codeMirror,
			})
			const keymapExtension = new KeymapExtension({
				...state,
				codeMirror,
				languageInput,
			})
			const domAdapter = new ReactDomAdapter({
				...state,
				codeMirror,
				languageRepository,
				bridge,
				languageInput,
			})
			const codeBlockView = new CodeBlockView({
				...state,
				bridge,
				dom: domAdapter.root,
				extensions: [...baseExtensions, keymapExtension],
			})

			codeMirror.set(codeBlockView.codeMirror)
			domAdapter.render()
			bridge.readLanguage()

			return codeBlockView
		}
	},
)

export const codeBlock = [codeBlockCtx, codeBlockView]
