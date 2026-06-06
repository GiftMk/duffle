import type { Document } from '@duffle/api'
import { listenerCtx } from '@milkdown/kit/plugin/listener'
import {
	debounceStrategy,
	type TransactionWithMutations,
	usePacedMutations,
} from '@tanstack/react-db'
import { useEffect } from 'react'
import { documentCollection, handleUpdate } from '../../common/lib/collections'
import { useEditorInstance } from './use-editor-instance'

export const useAutoSave = (id: string, delayMs = 1000) => {
	const editor = useEditorInstance()

	const mutate = usePacedMutations<Pick<Document, 'id' | 'markdown'>>({
		onMutate: (document) => {
			documentCollection.update(document.id, (draft) => {
				draft.markdown = document.markdown
			})
		},
		mutationFn: async ({ transaction }) =>
			handleUpdate(
				transaction as unknown as TransactionWithMutations<Document, 'update'>,
			),
		strategy: debounceStrategy({ wait: delayMs }),
	})

	useEffect(() => {
		if (!editor) {
			return
		}

		const listenerManager = editor.ctx.get(listenerCtx)
		listenerManager.markdownUpdated((_, markdown) => mutate({ id, markdown }))
	}, [mutate, editor, id])
}
