import { Compartment } from '@codemirror/state'
import type { ViewUpdate } from '@codemirror/view'
import type { Node } from '@milkdown/prose/model'
import { TextSelection } from '@milkdown/prose/state'
import type { EditorView } from '@milkdown/prose/view'
import { EditorView as CodeMirror } from 'codemirror'
import type { LanguageCollection, LanguageMeta } from './language-collection'
import type { LazyCodeMirror } from './lazy-code-mirror'
import { Observable } from './observable'

type CodeMirrorBridgeParams = {
	node: Node
	view: EditorView
	codeMirror: LazyCodeMirror
	languages: LanguageCollection
	getPosition: () => number | undefined
}

export class CodeMirrorBridge {
	private node: Node
	private readonly view: EditorView
	private readonly codeMirror: LazyCodeMirror
	private readonly getPosition: () => number | undefined
	private readonly languages: LanguageCollection
	private readonly compartment = new Compartment()
	private isUpdating = false
	private _language: Observable<LanguageMeta | null> = new Observable(null)

	constructor({
		node,
		view,
		codeMirror,
		getPosition,
		languages,
	}: CodeMirrorBridgeParams) {
		this.node = node
		this.view = view
		this.codeMirror = codeMirror
		this.getPosition = getPosition
		this.languages = languages
	}

	get extensions() {
		return [
			CodeMirror.updateListener.of((update) => this.pushContent(update)),
			this.compartment.of([]),
		]
	}

	get language() {
		return this._language
	}

	pushContent(update: ViewUpdate) {
		if (!this) {
			return
		}

		const codeMirror = this.codeMirror.value

		if (this.isUpdating || !codeMirror.hasFocus) {
			return
		}

		let offset = (this.getPosition() ?? 0) + 1
		const { main } = update.state.selection

		const codeMirrorSelection = {
			from: offset + main.from,
			to: offset + main.to,
		}
		const proseMirrorSelection = this.view.state.selection

		if (
			update.docChanged ||
			proseMirrorSelection.from !== codeMirrorSelection.from ||
			proseMirrorSelection.to !== codeMirrorSelection.to
		) {
			const transaction = this.view.state.tr

			update.changes.iterChanges((fromA, toA, fromB, toB, text) => {
				if (text.length) {
					transaction.replaceWith(
						offset + fromA,
						offset + toA,
						this.view.state.schema.text(text.toString()),
					)
				} else {
					transaction.delete(offset + fromA, offset + toA)
				}
				offset += toB - fromB - (toA - fromA)
			})

			transaction.setSelection(
				TextSelection.create(
					transaction.doc,
					codeMirrorSelection.from,
					codeMirrorSelection.to,
				),
			)
			this.view.dispatch(transaction)
		}
	}

	pullContent(node: Node): boolean {
		const codeMirror = this.codeMirror.value

		if (node.type !== this.node.type) {
			return false
		}

		this.node = node

		if (this.isUpdating) {
			return true
		}

		this.pullLanguage()

		const currentText = codeMirror.state.doc.toString()
		const newText = node.textContent

		if (currentText === newText) {
			return true
		}

		let start = 0
		let currentEnd = currentText.length
		let newEnd = newText.length

		while (
			start < currentEnd &&
			currentText.charCodeAt(start) === newText.charCodeAt(start)
		) {
			start++
		}

		while (
			currentEnd > start &&
			newEnd > start &&
			currentText.charCodeAt(currentEnd - 1) === newText.charCodeAt(newEnd - 1)
		) {
			currentEnd--
			newEnd--
		}

		this.isUpdating = true
		codeMirror.dispatch({
			changes: {
				from: start,
				to: currentEnd,
				insert: newText.slice(start, newEnd),
			},
			scrollIntoView: true,
		})
		this.isUpdating = false

		return true
	}

	pullLanguage() {
		const codeMirror = this.codeMirror.value
		const languageId = this.node.attrs.language as string
		const language = this.languages.getById(languageId)

		if (languageId === this._language.snapshot?.id || !language) {
			return
		}

		this.languages
			.getExtensionsAysnc(languageId.toLowerCase())
			.then((value) => {
				if (!value) {
					return
				}

				codeMirror.dispatch({
					effects: this.compartment.reconfigure(value),
				})

				this._language.update({ id: languageId, name: language.name })
			})
			.catch(console.error)
	}

	pushLanguage(language: LanguageMeta) {
		this.view.dispatch(
			this.view.state.tr.setNodeAttribute(
				this.getPosition() ?? 0,
				'language',
				language.id,
			),
		)
		this._language.update(language)
	}

	pullSelection(anchor: number, head: number) {
		const codeMirror = this.codeMirror.value

		if (!codeMirror.dom.isConnected) {
			requestAnimationFrame(() => this.pullSelection(anchor, head))
			return
		}

		codeMirror.focus()
		this.isUpdating = true
		codeMirror.dispatch({ selection: { anchor, head } })
		this.isUpdating = false
	}
}
