import { Compartment } from '@codemirror/state'
import type { ViewUpdate } from '@codemirror/view'
import type { Node } from '@milkdown/prose/model'
import { TextSelection } from '@milkdown/prose/state'
import type { EditorView } from '@milkdown/prose/view'
import { EditorView as CodeMirror } from 'codemirror'
import type { LanguageRecord, LanguageRepository } from './language-repository'
import type { Reference } from './reference'

type CodeMirrorBridgeParams = {
	node: Reference<Node>
	view: EditorView
	getPos: () => number | undefined
	codeMirror: Reference<CodeMirror | null>
	languageRepository: LanguageRepository
}

type Subscription = 'language'

type Subscriber = {
	notify: () => void
}

export class CodeMirrorBridge {
	private node: Reference<Node>
	private readonly view: EditorView
	private readonly getPos: () => number | undefined
	private readonly codeMirror: Reference<CodeMirror | null>
	private readonly languageRepository: LanguageRepository
	private readonly compartment = new Compartment()
	private isUpdating = false
	private readonly subscribers: Record<Subscription, Subscriber[]> = {
		language: [],
	}

	constructor({
		node,
		view,
		getPos,
		codeMirror,
		languageRepository,
	}: CodeMirrorBridgeParams) {
		this.node = node
		this.view = view
		this.getPos = getPos
		this.codeMirror = codeMirror
		this.languageRepository = languageRepository
	}

	get extensions() {
		return [
			CodeMirror.updateListener.of((update) => this.writeContent(update)),
			this.compartment.of([]),
		]
	}

	get language(): string {
		return this.node.value.attrs.language as string
	}

	subscribe(subscription: Subscription, subscriber: Subscriber) {
		const index = this.subscribers[subscription].push(subscriber)
		return () => this.subscribers[subscription].splice(index - 1, 1)
	}

	private notifySubscribers(subscription: Subscription) {
		for (const subscriber of this.subscribers[subscription]) {
			subscriber.notify()
		}
	}

	writeContent(update: ViewUpdate) {
		if (!this) {
			return
		}

		if (
			this.isUpdating ||
			!this.codeMirror.value ||
			!this.codeMirror.value.hasFocus
		) {
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
		if (!this.codeMirror.value || node.type !== this.node.value.type) {
			return false
		}

		const codeMirror = this.codeMirror.value
		this.node.set(node)

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
		const languageId = this.node.value.attrs.language as string
		const languageDescription =
			this.languageRepository.getDescriptionById(languageId)

		if (!this.codeMirror.value || !languageDescription) {
			return
		}

		const codeMirror = this.codeMirror.value
		this.languageRepository
			.getExtensions(languageId.toLowerCase())
			.then((value) => {
				if (!value) {
					return
				}

				codeMirror.dispatch({
					effects: this.compartment.reconfigure(value),
				})

				this.notifySubscribers('language')
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
		this.readLanguage()
		this.notifySubscribers('language')
	}

	readSelection(anchor: number, head: number) {
		if (!this.codeMirror.value) {
			return
		}

		const codeMirror = this.codeMirror.value
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
