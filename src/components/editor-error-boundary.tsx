import { Component, type ReactNode } from 'react'

type EditorErrorBoundaryProps = {
	children: ReactNode
}

type EditorErrorBoundaryState = {
	hasError: boolean
}

export class EditorErrorBoundary extends Component<
	EditorErrorBoundaryProps,
	EditorErrorBoundaryState
> {
	override state: EditorErrorBoundaryState = { hasError: false }

	static getDerivedStateFromError() {
		return { hasError: true }
	}

	override componentDidCatch(error: unknown) {
		console.error('Markdown editor crashed, recovering', error)
	}

	override render() {
		if (this.state.hasError) {
			return null
		}

		return this.props.children
	}
}
