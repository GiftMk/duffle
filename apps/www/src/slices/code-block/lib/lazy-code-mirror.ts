import type { EditorView as CodeMirror } from 'codemirror'

export class LazyCodeMirror {
	private current: CodeMirror | null = null

	set(instance: CodeMirror) {
		this.current = instance
	}

	get hasValue(): boolean {
		return !!this.current
	}

	get value(): CodeMirror {
		if (!this.current) {
			throw new Error('Code mirror instance is not initialized.')
		}

		return this.current
	}
}
