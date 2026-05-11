import type { Editor } from '@milkdown/kit/core'
import { useInstance } from '@milkdown/react'
import { useEffect, useState } from 'react'

export const useEditorInstance = () => {
	const [instance, setInstance] = useState<Editor | null>(null)
	const [isLoading, getEditor] = useInstance()

	useEffect(() => {
		if (isLoading) {
			return
		}

		const editor = getEditor()

		if (!editor) {
			return
		}

		setInstance(editor)
	}, [isLoading, getEditor])

	return instance
}
