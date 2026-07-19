import type { FileAsset } from '#/types'
import { createAtom } from '@xstate/store'

export const pendingFilesAtom = createAtom<FileAsset[]>([])
