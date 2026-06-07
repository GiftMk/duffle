import { Compartment } from '@codemirror/state'
import type { ViewUpdate } from '@codemirror/view'
import type { Node } from '@milkdown/prose/model'
import { TextSelection } from '@milkdown/prose/state'
import type { EditorView } from '@milkdown/prose/view'
import type { Atom } from '@tanstack/react-store'
import { EditorView as CodeMirror } from 'codemirror'
import type { LanguageRecord, LanguageRepository } from './language-repository'

type CodeMirrorBridgeParams = {
	node: Node
	view: EditorView
	getPos: () => number | undefined
	codeMirrorAtom: Atom<CodeMirror | null>
	languageAtom: Atom<LanguageRecord | null>
	languageRepository: LanguageRepository
}

export class CodeMirrorBridge {
	private node: Node
	private readonly view: EditorView
	private readonly getPos: () => number | undefined
	private readonly codeMirrorAtom: Atom<CodeMirror | null>
	private readonly languageAtom: Atom<LanguageRecord | null>
	private readonly languageRepository: LanguageRepository
	private readonly compartment = new Compartment()
	private isUpdating = false

	constructor({
		node,
		view,
		getPos,
		codeMirrorAtom,
		languageAtom,
		languageRepository,
	}: CodeMirrorBridgeParams) {
		this.node = node
		this.view = view
		this.getPos = getPos
		this.codeMirrorAtom = codeMirrorAtom
		this.languageAtom = languageAtom
		this.languageRepository = languageRepository
	}

	get extensions() {
		return [
			CodeMirror.updateListener.of((update) => this.writeContent(update)),
			this.compartment.of([]),
		]
	}

	writeContent(update: ViewUpdate) {
		if (!this) {
			return
		}

		const codeMirror = this.codeMirrorAtom.get()

		if (this.isUpdating || !codeMirror || !codeMirror.hasFocus) {
			return
		}

		let offset = (this.getPos() ?? 0) + 1
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

	readContent(node: Node): boolean {
		const codeMirror = this.codeMirrorAtom.get()

		if (!codeMirror || node.type !== this.node.type) {
			return false
		}

		this.node = node

		if (this.isUpdating) {
			return true
		}

		this.readLanguage()

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

	readLanguage() {
		const codeMirror = this.codeMirrorAtom.get()
		const langauge = this.languageAtom.get()
		const languageId = this.node.attrs.language as string
		const languageDescription =
			this.languageRepository.getDescriptionById(languageId)

		if (!codeMirror || languageId === langauge?.id || !languageDescription) {
			return
		}

		this.languageRepository
			.getExtensions(languageId.toLowerCase())
			.then((value) => {
				if (!value) {
					return
				}

				console.log('language', {
					id: languageId,
					name: languageDescription.name,
				})

				codeMirror.dispatch({
					effects: this.compartment.reconfigure(value),
				})

				this.languageAtom.set({
					id: languageId,
					name: languageDescription.name,
				})
			})
			.catch(console.error)
	}

	writeLanguage(language: LanguageRecord) {
		this.view.dispatch(
			this.view.state.tr.setNodeAttribute(
				this.getPos() ?? 0,
				'language',
				language.id,
			),
		)
		this.languageAtom.set(language)
	}

	readSelection(anchor: number, head: number) {
		const codeMirror = this.codeMirrorAtom.get()

		if (!codeMirror) {
			return
		}

		if (!codeMirror.dom.isConnected) {
			requestAnimationFrame(() => this.readSelection(anchor, head))
			return
		}

		codeMirror.focus()
		this.isUpdating = true
		codeMirror.dispatch({ selection: { anchor, head } })
		this.isUpdating = false
	}
}
